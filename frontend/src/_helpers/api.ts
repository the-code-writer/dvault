import axios from "axios";

const baseURL = import.meta.env.VITE_APP_API_BASE_URL;

const getCurrentUserAccessToken:any = () => {

  return "";

}

//Create Axios Instance
const AxiosAPI = {
  getQueryVariable: (windowObj: any, key: any) => {
    //todo: doesn't belong

    if (typeof windowObj !== undefined) {
      var query = windowObj.location.search.substring(1);
      var vars = query.split("&");
      //console.log(2222, vars); //[ 'app=article', 'act=news_content', 'aid=160990' ]
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        //console.log(pair); //[ 'app', 'article' ][ 'act', 'news_content' ][ 'aid', '160990' ]
        if (pair[0] == key) {
          return pair[1];
        }
      }
    }
    return "";
  },
  apiRequest: (method: string, url: string, data: any) => {
    var config = {
      method: method,
      url: baseURL + url,
      headers: {
        Authorization: "Bearer " + getCurrentUserAccessToken(),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    if(data){
      config.data = data;
    }

    return axios(config);
  },
  publicApiRequest: (method: string, url: string, data: any) => {
    var config = {
      method: method,
      url: baseURL + url,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    if(data){
      config.data = data;
    }

    return axios(config);
  },
  getAllTransactions: () => {
    var config = {
      method: "get",
      url: baseURL + "/transactions/get-txn",
      headers: {
        //Authorization: "Bearer " + getCurrentUserAccessToken(),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios(config);
  },
  getTransaction: (id:string) => {
    var config = {
      method: "get",
      url: baseURL + "/transactions/get-txn" + id,
      headers: {
        //Authorization: "Bearer " + getCurrentUserAccessToken(),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return axios(config);
  },
  saveTransaction: (data: any) => {
    var config = {
      method: "post",
      url: baseURL + "/transactions/save-txn",
      headers: {
        //Authorization: "Bearer " + getCurrentUserAccessToken(),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: data
    };
    return axios(config);
  },
};
export default AxiosAPI;

export { AxiosAPI }
