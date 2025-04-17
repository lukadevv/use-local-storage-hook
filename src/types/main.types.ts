export type useStorageType = <T>(
  key: string,
  initialValue: T
) => [T, (value: T) => void];
