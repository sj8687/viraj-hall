import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 300 }); // 5 min TTL (optional)

export default cache;
