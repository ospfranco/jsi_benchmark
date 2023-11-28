import MyModule from "./src/MyModule";

export function answer(): number {
  return MyModule.answer();
}

export function getExpoRecord(): { duck: string } {
  return MyModule.getExpoRecord();
}
