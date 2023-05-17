import axios from 'axios';
import { ElMessage } from 'element-plus';

axios.defaults.timeout = 10000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8;multipart/form-data';
axios.defaults.withCredentials = true; //允许跨域携带cookie信息

// 请求拦截器
// axios.interceptors.request.use(
//     config => {
//         // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
//         // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
//         const token = store.state.token
//         token && (config.headers.Authorization = token)
//         return config
//     },
//     error => {
//         return Promise.error(error)
//     }
// )

// 响应拦截器
axios.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return Promise.resolve(response);
    } else {
      ElMessage('数据加载失败请稍后重试');
      return Promise.resolve({});
    }
  },
  // 服务器状态码不是200的情况
  error => {
    if (error.response.status === 301) {
      ElMessage.error('请登录');
    } else {
      ElMessage('数据加载失败请稍后重试');
    }
    return Promise.resolve({});
  }
);

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params,
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}
