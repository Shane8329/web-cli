import FormData from "form-data";
import http from "node:http";
import type { OutgoingHttpHeaders } from "node:http2";
import https from "node:https";
import Url from "node:url";

export type RequestOptions = {
  type?: "json" | "text" | "buffer";
  data?: any;
  headers?: OutgoingHttpHeaders;
  onProgress?: (percent: number) => void;
  method?: "GET" | "HEAD" | "POST" | "DELETE" | "OPTIONS" | "PUT";
};

export default function request<T = any>(url, options?: RequestOptions) {
  return new Promise<T>((resolve, reject) => {
    const { type = "json", method = "GET", headers = {}, data = null } = options || {};
    const urlParse = Url.parse(url, true);
    const isHttps = urlParse?.protocol === "https:";
    const requestOptions = {
      hostname: urlParse?.hostname,
      port: urlParse?.port,
      path: urlParse?.path,
      method,
      headers,
    };
    const req = (isHttps ? https : http).request(requestOptions, (res) => {
      if (type === "buffer") {
        resolve(res as T);
        return;
      }
      let data = "";

      res.on("data", (chunk) => {
        data += chunk.toString();
      });

      res.on("error", (err) => {
        reject(err);
      });

      res.on("end", () => {
        let result = data;
        if (type === "json") {
          result = JSON.parse(data);
        }
        resolve(result as T);
      });
    });

    if (data && data instanceof FormData) {
      data.pipe(req);
    } else if (data) {
      req.write(data);
      req.end();
    } else {
      req.end();
    }
  });
}
