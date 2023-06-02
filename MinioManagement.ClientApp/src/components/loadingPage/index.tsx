import { Suspense } from "react"
import Loading from "./loading"

const LoadingPage = (props: any) => {
    return <Suspense fallback={<Loading />}>
        {props.children}
    </Suspense>
}
export default LoadingPage