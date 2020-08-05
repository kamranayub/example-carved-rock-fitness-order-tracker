// Patched version: https://github.com/streamich/react-use/pull/1416/commits/5cebdf0618a64d59cfe7f8061de26ac622712a3f
/* eslint-disable */
import { useEffect, useState } from "react";
import { off, on } from "react-use/lib/util";

type PermissionDesc =
  | PermissionDescriptor
  | DevicePermissionDescriptor
  | MidiPermissionDescriptor
  | PushPermissionDescriptor;

type State = PermissionState | "";

const noop = () => {};

const usePermission = (permissionDesc: PermissionDesc): State => {
  let mounted = true;
  let permissionStatus: PermissionStatus | null = null;

  const [state, setState] = useState<State>("");

  const onChange = () => {
    if (mounted && permissionStatus) {
      setState(permissionStatus.state);
    }
  };

  const changeState = () => {
    onChange();
    on(permissionStatus, "change", onChange);
  };

  useEffect(() => {
    // Permissions API is not available in every browser
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query(permissionDesc)
        .then((status) => {
          permissionStatus = status;
          changeState();
        })
        .catch(noop);
    }

    return () => {
      mounted = false;
      permissionStatus && off(permissionStatus, "change", onChange);
    };
  }, []);

  return state;
};

export default usePermission;
