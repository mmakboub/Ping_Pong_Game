import apiClient from "./api-client";

// interface Entity {
//   id: number;
// }

class HttpService {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  getAllFor<T>(path: string, id: string) {
    const controller = new AbortController(); // to cancel the request
    const request = apiClient.get<T[]>(`${this.endpoint}${path}${id}`, {
      signal: controller.signal,
    });
    return {
      request,
      cancel: () => controller.abort(),
    };
  }

  getAll<T>(route: string) {
    const controller = new AbortController(); // to cancel the request
    const request = apiClient.get<T[]>(`${this.endpoint}${route}`, {
      signal: controller.signal,
    });
    return {
      request,
      cancel: () => controller.abort(),
    };
  }
  getUser<T>() {
      const controller = new AbortController();
      const request = apiClient.get<T>(`${this.endpoint}`, {
        signal: controller.signal,
      });
      return {
        request,
        cancel: () => controller.abort(),
      };

  }
  getOne<T>(route: string, id: string) {
    const controller = new AbortController();
    const request = apiClient.get<T>(`${this.endpoint}${route}${id}`, {
      signal: controller.signal,
    });
    return {
      request,
      cancel: () => controller.abort(),
    };
  }

  delete<T>(route: string) {
    const request = apiClient.delete<T>(`${this.endpoint}${route}`);
    return request;
  }

  deleteAll() {
    const request = apiClient.delete(this.endpoint);
    return request;
  }
  add<T>(route: string, entity: T) {
    const request = apiClient.post(`${this.endpoint}${route}`, entity);
    return request;
  }

  update<T>(route: string, entity: T) {
    const request = apiClient.patch<T>(`${this.endpoint}${route}`, entity);
    return request;
  }
}

const create = (endpoint: string) => {
  return new HttpService(endpoint);
};

export default create;
