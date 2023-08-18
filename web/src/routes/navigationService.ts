type NavigateFunction = (path: string) => void;

let navigationService: { navigate: NavigateFunction | null } = {
  navigate: null,
};

export const setNavigator = (navigate: NavigateFunction): void => {
  navigationService.navigate = navigate;
};

export const navigate = (path: string): void => {
  if (navigationService.navigate) {
    navigationService.navigate(path);
  } else {
    console.error("Navigation service not initialized");
  }
};
