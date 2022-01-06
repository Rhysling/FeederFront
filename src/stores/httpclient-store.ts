import axios from "axios";
import { derived } from "svelte/store";
import { user } from "./user-store";

declare var baseURL: string;

export const httpClient = derived(
	user,
	$user => {
    let opts = { baseURL };

    if ($user.token)
      opts = { ...opts, ...{ headers: { Authorization: $user.token } } };

    let instance = axios.create(opts);

    instance.interceptors.response.use(
      res => res,
      err => {
        if (err.response.status === 401)
          user.logOut();

        return Promise.reject(err);
      }
    );

    return instance;
  }
);
