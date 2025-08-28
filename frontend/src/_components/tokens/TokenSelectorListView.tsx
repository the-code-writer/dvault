/* eslint-disable */
import React, { useEffect, useMemo, useState } from "react";

import { IToken, ITokenSelectorListView } from ".";

import "./token-selector.scss";
import tokenListData from "./list.json";

import { Divider, List, Skeleton } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import { ExportOutlined } from "@ant-design/icons";
import { snippets } from "../../_helpers";

const TokenSelectorListView: React.FC<ITokenSelectorListView> = ({
  children,
  ...props
}): any | null => {
  const { searchCriteria, onSelectToken } = props;

  const defaultToken = useMemo<IToken>(() => {
    return {
      tokenName: "SOL",
      tokenSymbol: "SOL",
      tokenIcon: "/logo.png",
      tokenAddress: "SOL",
      tokenType: "SOL",
      isTokenVerified: true,
    };
  }, []);

  const [selectedToken, setSelectedToken] = useState<IToken>(defaultToken);

  useEffect(() => {
    setSelectedToken(defaultToken);
  }, [defaultToken]);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(tokenListData);

  const filterDataById = (searchTerm: string) => {
    if (searchTerm.length > 0) {
      console.log("Search 1", searchTerm);
      const regex = new RegExp(searchTerm, "i");
      const filteredData = data.filter((item: any) => regex.test(item.name));
      console.log("Search 2", searchTerm);
      setData(filteredData);
    } else {
      console.log("No, Search", searchTerm, tokenListData, selectedToken);
      setData(tokenListData);
    }
  };

  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    fetch("https://token.jup.ag/strict")
      .then((res) => res.json())
      .then((body) => {
        setData([...data, ...body.results]);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    filterDataById(searchCriteria);
  }, [searchCriteria]);

  useEffect(() => {
    loadMoreData();
  }, []);

  const [imgSrcs, setImgSrcs] = useState(
    data.map((item: any) => item.logoURI)
  );

  const handleImageLoadError = (index: number) => {
    setImgSrcs((prevSrcs: any) => {
      const updatedSrcs = [...prevSrcs];
      updatedSrcs[index] = "/assets/images/icons/no-image.png";
      return updatedSrcs;
    });
  };

  useEffect(() => {
    onSelectToken(selectedToken);
  }, [selectedToken]);

  return (
    <>
      <div
        style={{
          height: 360,
          overflow: "auto",
          padding: "0 10px",
          border: "1px solid rgba(140, 140, 140, 0.35)",
          borderRadius: "5px",
        }}
      >
        <InfiniteScroll
          dataLength={data.length}
          next={loadMoreData}
          hasMore={data.length < 50}
          loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
          endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
          scrollableTarget="scrollableDiv"
        >
          <List
            dataSource={data}
            renderItem={(item: any, itemIndex: number) => (
              <List.Item key={itemIndex}
                onClick={() => {
                  setSelectedToken(item);
                }}>
                <List.Item.Meta
                  avatar={
                    <img
                      alt={item.name}
                      src={imgSrcs[itemIndex]} onError={() => handleImageLoadError(itemIndex)}
                      style={{ width: 48, marginRight: 8, marginTop: 6, borderRadius: 48 }}
                      className="txn-select-token-pill-icon"
                    />
                  }
                  title={
                    <span className="txn-select-token-list-view-title">
                      {item.symbol}
                    </span>
                  }
                  description={
                    <span className="txn-select-token-list-view-sub-title">
                      {item.name}
                    </span>
                  }
                />
                <div className="txn-select-token-list-view-sub-title">
                  <a
                    target="_blank"
                    href={`https://explorer.solana.com/address/${item.address}/tokens`}
                  >
                    <code>
                      {snippets.strings.shortenAddress(item.address)}&nbsp;
                    </code>
                    <ExportOutlined />
                  </a>
                </div>
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
    </>
  );
};

export { TokenSelectorListView };
