import { worldProps } from "../../data/worldProps";
import WorldProp from "./WorldProp";

export default function WorldProps() {
  return (
    <>
      {worldProps.map((prop) => (
        <WorldProp key={prop.id} prop={prop} />
      ))}
    </>
  );
}
