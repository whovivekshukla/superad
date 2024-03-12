export const trimJson = (jsonParam) => {
  const json = jsonParam.lc_kwargs.content;

  const jsonStr = json.slice(json.indexOf("{"), json.lastIndexOf("}") + 1);

  const jsonObj = JSON.parse(jsonStr);

  return jsonObj;
};
