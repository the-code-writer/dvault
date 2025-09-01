/* eslint-disable */
type LimitsT = {
    foo: boolean;
};

interface ILimits {
    withdrawalLimit?: number; monthlyLimit?: number; availableMonthly?: number;
    children?: React.ReactNode;
}

export type { LimitsT, ILimits};
