export type AppState = {
  events: EventListItemProps[]
}

export type EventListProps = {
  events: EventListItemProps[]
}

export type EventListItemProps = {
  id: string,
  name: string,
  description?: string,
  startDate: Date,
  endDate?: Date,
}
