export {};

export type RootStackParamList = {
  Home: undefined,
  Login: undefined,
  AddEventModal: undefined,
  DeleteEventModal: { id: string },
  EditEventModal: undefined,
}

// https://reactnavigation.org/docs/typescript#specifying-default-types-for-usenavigation-link-ref-etc
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
