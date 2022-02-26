export {};

export type RootStackParamList = {
  Home: undefined,
  Login: undefined,
  Settings: undefined,
  AddEventModal: undefined,
  DeleteEventModal: { id: string },
  EditEventModal: { id: string },
}

// https://reactnavigation.org/docs/typescript#specifying-default-types-for-usenavigation-link-ref-etc
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
