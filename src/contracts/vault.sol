// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SecureVault is ReentrancyGuard, Ownable(msg.sender) {
    using SafeERC20 for IERC20;

    IERC20 public usdt; //0x3643b7a9F6338115159a4D3a2cc678C99aD657aa

    //USER 0xdD870fA1b7C4700F2BD7f44238821C26f7392148

    //TRUSTED 0x326188641F1cd1B996036A7d699D2367488c7957

    //VAULT 0xE958D39c97216b45b46dC45c846931F12E99D78F

    // Withdrawal limits based on balance (in USDT's 6 decimals)
    uint256 public constant TIER_1_LIMIT = 1000 * 1e6;
    uint256 public constant TIER_2_LIMIT = 500 * 1e6;
    uint256 public constant TIER_3_LIMIT = 250 * 1e6;
    uint256 public constant TIER_4_LIMIT = 125 * 1e6;

    // Balance thresholds (in USDT's 6 decimals)
    uint256 public constant THRESHOLD_1 = 3000 * 1e6;
    uint256 public constant THRESHOLD_2 = 1500 * 1e6;
    uint256 public constant THRESHOLD_3 = 750 * 1e6;

    // Password protection system
    address public trustedPartner;
    address public pendingTrustedPartner;
    bytes32 private currentPasswordHash;
    uint256 private passwordExpiry;
    uint256 private constant PASSWORD_VALIDITY = 7 days;

    // Emergency withdrawal cooldown
    uint256 public constant EMERGENCY_WITHDRAWAL_COOLDOWN = 30 days;
    uint256 public lastEmergencyWithdrawal;

    // Discipline reward system
    uint256 public constant DISCIPLINE_REWARD = 50 * 1e6;
    uint256 public lastSuccessfulWithdrawal;
    uint256 public consecutiveDisciplinedMonths;

    // Withdrawal tracking
    uint256 public constant MAX_MONTHLY_WITHDRAWALS = 3;
    uint256 public constant WITHDRAWAL_DAY_THRESHOLD = 15;

    struct WithdrawalInfo {
        uint256 monthlyWithdrawals;
        uint256 lastWithdrawalMonth;
        uint256 totalWithdrawnThisMonth;
    }

    struct SavingsGoal {
        string purpose;
        uint256 targetAmount;
        uint256 currentAmount;
        uint256 targetDate;
        bool completed;
    }

    struct ScheduledWithdrawal {
        uint256 amount;
        uint256 scheduledTime;
        string purpose;
        bool executed;
    }

    mapping(address => WithdrawalInfo) public withdrawalRecords;
    SavingsGoal[] public savingsGoals;
    ScheduledWithdrawal[] public scheduledWithdrawals;

    // Accountability partners (can view but not withdraw)
    mapping(address => bool) public accountabilityPartners;

    // Events
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event EmergencyWithdraw(address indexed owner, uint256 amount);
    event PasswordSetByPartner(address indexed partner);
    event TrustedPartnerProposed(address indexed oldPartner, address indexed newPartner);
    event TrustedPartnerChanged(address indexed oldPartner, address indexed newPartner);
    event SavingsGoalCreated(uint256 goalId, string purpose, uint256 targetAmount, uint256 targetDate);
    event SavingsGoalCompleted(uint256 goalId);
    event WithdrawalScheduled(uint256 scheduleId, uint256 amount, uint256 scheduledTime, string purpose);
    event WithdrawalCanceled(uint256 scheduleId);
    event AccountabilityPartnerAdded(address partner);
    event DisciplineRewardClaimed(address user, uint256 amount);

    constructor(address _usdtAddress, address _trustedPartner)   {
    usdt = IERC20(_usdtAddress);
    trustedPartner = _trustedPartner;
        transferOwnership(msg.sender);
    lastSuccessfulWithdrawal = block.timestamp;
}

    /**
     * @dev Propose a new trusted partner (first step of two-step process)
     */
    function proposeTrustedPartner(address newPartner) external onlyOwner {
        require(newPartner != address(0), "Invalid partner address");
        pendingTrustedPartner = newPartner;
        emit TrustedPartnerProposed(trustedPartner, newPartner);
    }

    /**
     * @dev Accept the proposed trusted partner (second step of two-step process)
     */
    function acceptTrustedPartner() external {
        require(msg.sender == pendingTrustedPartner, "Only pending partner can accept");
        emit TrustedPartnerChanged(trustedPartner, pendingTrustedPartner);
        trustedPartner = pendingTrustedPartner;
        pendingTrustedPartner = address(0);
    }

    /**
     * @dev Set a new password hash (can only be called by trusted partner)
     * @param passwordHash The keccak256 hash of the password
     */
    function setPasswordHash(bytes32 passwordHash) external {
        require(msg.sender == trustedPartner, "Only trusted partner can set password");
        currentPasswordHash = passwordHash;
        passwordExpiry = block.timestamp + PASSWORD_VALIDITY;
        emit PasswordSetByPartner(msg.sender);
    }

    /**
     * @dev Emergency withdrawal with password verification
     * @param amount Amount to withdraw
     * @param password The password provided by trusted partner
     */
    function emergencyWithdraw(uint256 amount, string memory password) external nonReentrant onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        require(block.timestamp >= lastEmergencyWithdrawal + EMERGENCY_WITHDRAWAL_COOLDOWN, "Emergency withdrawal cooldown active");
        require(block.timestamp <= passwordExpiry, "Password expired");
        require(keccak256(abi.encodePacked(password)) == currentPasswordHash, "Invalid password");

        uint256 contractBalance = usdt.balanceOf(address(this));
        require(amount <= contractBalance, "Insufficient vault balance");

        // Invalidate password after use
        currentPasswordHash = 0;

        // Update cooldown and reset discipline streak
        lastEmergencyWithdrawal = block.timestamp;
        consecutiveDisciplinedMonths = 0;

        usdt.safeTransfer(msg.sender, amount);
        emit EmergencyWithdraw(msg.sender, amount);
    }

    /**
     * @dev Check if emergency withdrawal is available
     */
    function canEmergencyWithdraw() external view returns (bool) {
        return currentPasswordHash != 0 &&
               block.timestamp <= passwordExpiry &&
               block.timestamp >= lastEmergencyWithdrawal + EMERGENCY_WITHDRAWAL_COOLDOWN;
    }

    /**
     * @dev Deposit USDT into the vault
     */
    function deposit(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        usdt.safeTransferFrom(msg.sender, address(this), amount);
        emit Deposited(msg.sender, amount);
    }

    /**
     * @dev Create a savings goal with specific purpose and target
     */
    function createSavingsGoal(string memory _purpose, uint256 _targetAmount, uint256 _monthsToTarget) external onlyOwner {
        require(_targetAmount > 0, "Target amount must be greater than 0");
        require(_monthsToTarget > 0, "Must have at least 1 month to target");

        uint256 targetDate = block.timestamp + (_monthsToTarget * 30 days);

        savingsGoals.push(SavingsGoal({
            purpose: _purpose,
            targetAmount: _targetAmount,
            currentAmount: 0,
            targetDate: targetDate,
            completed: false
        }));

        emit SavingsGoalCreated(savingsGoals.length - 1, _purpose, _targetAmount, targetDate);
    }

    /**
     * @dev Schedule a withdrawal for future date (helps with planning)
     */
    function scheduleWithdrawal(uint256 amount, uint256 daysFromNow, string memory purpose) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        require(daysFromNow >= 1, "Must schedule at least 1 day in advance");
        require(isAfter15th() || daysFromNow >= WITHDRAWAL_DAY_THRESHOLD, "Can only schedule after 15th or for after 15th");

        uint256 scheduledTime = block.timestamp + (daysFromNow * 1 days);

        scheduledWithdrawals.push(ScheduledWithdrawal({
            amount: amount,
            scheduledTime: scheduledTime,
            purpose: purpose,
            executed: false
        }));

        emit WithdrawalScheduled(scheduledWithdrawals.length - 1, amount, scheduledTime, purpose);
    }

    /**
     * @dev Cancel a scheduled withdrawal
     */
    function cancelScheduledWithdrawal(uint256 scheduleId) external onlyOwner {
        require(scheduleId < scheduledWithdrawals.length, "Invalid schedule ID");
        require(!scheduledWithdrawals[scheduleId].executed, "Withdrawal already executed");
        scheduledWithdrawals[scheduleId].executed = true; // Mark as canceled
        emit WithdrawalCanceled(scheduleId);
    }

    /**
     * @dev Execute a scheduled withdrawal
     */
    function executeScheduledWithdrawal(uint256 scheduleId) external nonReentrant onlyOwner {
        require(scheduleId < scheduledWithdrawals.length, "Invalid schedule ID");

        ScheduledWithdrawal storage withdrawal = scheduledWithdrawals[scheduleId];
        require(!withdrawal.executed, "Withdrawal already executed");
        require(block.timestamp >= withdrawal.scheduledTime, "It's not time yet");
        require(isAfter15th(), "Withdrawals only allowed after 15th of month");

        _processWithdrawal(withdrawal.amount);
        withdrawal.executed = true;
    }

    /**
     * @dev Add an accountability partner (view-only access)
     */
    function addAccountabilityPartner(address partner) external onlyOwner {
        accountabilityPartners[partner] = true;
        emit AccountabilityPartnerAdded(partner);
    }

    /**
     * @dev Get current withdrawal limit based on vault balance
     */
    function getCurrentWithdrawalLimit() public view returns (uint256) {
        uint256 balance = usdt.balanceOf(address(this));

        if (balance >= THRESHOLD_1) {
            return TIER_1_LIMIT;
        } else if (balance >= THRESHOLD_2) {
            return TIER_2_LIMIT;
        } else if (balance >= THRESHOLD_3) {
            return TIER_3_LIMIT;
        } else {
            return TIER_4_LIMIT;
        }
    }

    /**
     * @dev Check if current time is after the 15th of the month
     */
    function isAfter15th() public view returns (bool) {
        (, , uint256 day) = _getDate(block.timestamp);
        return day >= WITHDRAWAL_DAY_THRESHOLD;
    }

    /**
     * @dev Get current month identifier (year * 100 + month)
     */
    function getCurrentMonth() public view returns (uint256) {
        (uint256 year, uint256 month, ) = _getDate(block.timestamp);
        return year * 100 + month;
    }

    /**
     * @dev Withdraw USDT from vault with discipline rewards
     */
    function withdraw(uint256 amount) external nonReentrant onlyOwner {
        require(isAfter15th(), "Withdrawals only allowed after 15th of month");
        _processWithdrawal(amount);

        // Reward system for disciplined behavior
        if (block.timestamp > lastSuccessfulWithdrawal + 25 days) {
            consecutiveDisciplinedMonths++;
            lastSuccessfulWithdrawal = block.timestamp;

            // Reward every 3 disciplined months
            if (consecutiveDisciplinedMonths % 3 == 0) {
                uint256 rewardAmount = DISCIPLINE_REWARD;
                uint256 contractBalance = usdt.balanceOf(address(this));
                if (contractBalance > rewardAmount * 2) {
                    usdt.safeTransfer(msg.sender, rewardAmount);
                    emit DisciplineRewardClaimed(msg.sender, rewardAmount);
                }
            }
        }
    }

    /**
     * @dev Internal withdrawal processing
     */
    function _processWithdrawal(uint256 amount) internal {
        require(amount > 0, "Amount must be greater than 0");

        uint256 currentMonth = getCurrentMonth();
        WithdrawalInfo storage info = withdrawalRecords[msg.sender];

        // Reset monthly counters if it's a new month
        if (info.lastWithdrawalMonth != currentMonth) {
            info.monthlyWithdrawals = 0;
            info.totalWithdrawnThisMonth = 0;
            info.lastWithdrawalMonth = currentMonth;
        }

        require(info.monthlyWithdrawals < MAX_MONTHLY_WITHDRAWALS, "Maximum 3 withdrawals per month");

        uint256 withdrawalLimit = getCurrentWithdrawalLimit();
        require(amount <= withdrawalLimit, "Amount exceeds withdrawal limit");
        require(info.totalWithdrawnThisMonth + amount <= withdrawalLimit * MAX_MONTHLY_WITHDRAWALS, "Exceeds monthly withdrawal limit");

        uint256 contractBalance = usdt.balanceOf(address(this));
        require(amount <= contractBalance, "Insufficient vault balance");

        // Update withdrawal records
        info.monthlyWithdrawals++;
        info.totalWithdrawnThisMonth += amount;

        // Perform withdrawal
        usdt.safeTransfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount);
    }

    /**
     * @dev Get vault balance in USDT
     */
    function getVaultBalance() external view returns (uint256) {
        return usdt.balanceOf(address(this));
    }

    /**
     * @dev Get user's withdrawal info
     */
    function getUserWithdrawalInfo(address user) external view returns (uint256 monthlyWithdrawals, uint256 lastWithdrawalMonth, uint256 totalWithdrawnThisMonth) {
        WithdrawalInfo memory info = withdrawalRecords[user];
        return (info.monthlyWithdrawals, info.lastWithdrawalMonth, info.totalWithdrawnThisMonth);
    }

    /**
     * @dev Get financial health metrics (for dashboard)
     */
    function getFinancialHealth() external view returns (
        uint256 totalBalance,
        uint256 currentWithdrawalLimit,
        uint256 disciplinedMonthsStreak,
        uint256 daysUntilNextWithdrawal,
        uint256 totalSavingsGoals,
        uint256 completedSavingsGoals
    ) {
        totalBalance = usdt.balanceOf(address(this));
        currentWithdrawalLimit = getCurrentWithdrawalLimit();
        disciplinedMonthsStreak = consecutiveDisciplinedMonths;

        // Calculate days until next withdrawal (after 15th)
        (, , uint256 day) = _getDate(block.timestamp);
        daysUntilNextWithdrawal = day < WITHDRAWAL_DAY_THRESHOLD ? WITHDRAWAL_DAY_THRESHOLD - day : 30 - day + WITHDRAWAL_DAY_THRESHOLD;

        totalSavingsGoals = savingsGoals.length;

        uint256 completed = 0;
        for (uint256 i = 0; i < savingsGoals.length; i++) {
            if (savingsGoals[i].completed) {
                completed++;
            }
        }
        completedSavingsGoals = completed;
    }

    /**
     * @dev Allow accountability partners to view balance only
     */
    function viewBalance() external view returns (uint256) {
        require(accountabilityPartners[msg.sender] || msg.sender == owner(), "Not authorized");
        return usdt.balanceOf(address(this));
    }

    /**
     * @dev Internal function to extract date from timestamp
     */
    function _getDate(uint256 timestamp) internal pure returns (uint256 year, uint256 month, uint256 day) {
    // Constants for date calculations
    uint256 SECONDS_PER_DAY = 86400;
    uint256 DAYS_PER_YEAR = 365;
    uint256 SECONDS_PER_YEAR = SECONDS_PER_DAY * DAYS_PER_YEAR;

    // Calculate year
    year = 1970 + timestamp / SECONDS_PER_YEAR;

    // Adjust for leap years
    uint256 leapDays = _getLeapDays(1970, year);
    uint256 secondsInYears = (year - 1970) * SECONDS_PER_YEAR + leapDays * SECONDS_PER_DAY;

    while (secondsInYears > timestamp) {
        year--;
        leapDays = _getLeapDays(1970, year);
        secondsInYears = (year - 1970) * SECONDS_PER_YEAR + leapDays * SECONDS_PER_DAY;
    }

    // Calculate remaining time after years
    uint256 remainingTime = timestamp - secondsInYears;

    // Calculate month
    uint8[12] memory monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (_isLeapYear(year)) {
        monthDays[1] = 29; // February has 29 days in leap year
    }

    month = 1;
    uint256 daysPassed = 0;

    for (uint256 i = 0; i < 12; i++) {
        uint256 secondsInMonth = uint256(monthDays[i]) * SECONDS_PER_DAY;
        if (remainingTime < secondsInMonth) {
            month = i + 1;
            break;
        }
        remainingTime -= secondsInMonth;
        daysPassed += uint256(monthDays[i]);
    }

    // Calculate day
    day = remainingTime / SECONDS_PER_DAY + 1;
}

    /**
     * @dev Check if a year is a leap year
     */
    function _isLeapYear(uint256 year) internal pure returns (bool) {
        if (year % 4 != 0) {
            return false;
        } else if (year % 100 != 0) {
            return true;
        } else if (year % 400 != 0) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * @dev Calculate number of leap days between two years
     */
    function _getLeapDays(uint256 startYear, uint256 endYear) internal pure returns (uint256) {
        uint256 leapDays = 0;
        for (uint256 year = startYear; year < endYear; year++) {
            if (_isLeapYear(year)) {
                leapDays++;
            }
        }
        return leapDays;
    }

    /**
     * @dev Allow receiving ETH (optional)
     */
    receive() external payable {}
}