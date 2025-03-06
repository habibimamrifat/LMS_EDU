import { Model } from "mongoose";

const documentConverter = <T extends Document>(model: Model<T>): Model<T & Document> => {
    return model as Model<T & Document>;
  };
  
  export default documentConverter;