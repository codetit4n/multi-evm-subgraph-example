import { BytesLike } from "ethers";

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PVT_KEY: BytesLike;
        }
    }
}
// export { }