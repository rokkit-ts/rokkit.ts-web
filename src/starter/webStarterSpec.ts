import {WebStarter} from "./webStarter";

const web: WebStarter = new WebStarter();

web.initializeModule(undefined).then(() => {
  console.log("Starting module");
});