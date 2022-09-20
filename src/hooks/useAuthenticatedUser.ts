import { useRef, useEffect, useState } from "react";
import { FLAG_TYPE, STATUS } from "../commons/status";
import { StorageHelper } from "../services/storage-helper";

export function useAuthenticatedUser() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect((): any => {
    StorageHelper.getValue(FLAG_TYPE.AUTHENTICATED_USER).then((value) => {
      if (value === STATUS.TRUE) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    });
  }, []);

  return authenticated;
}
