import { debounce } from "lodash"
import { useEffect, useMemo, useRef } from "react"

const useDebounce = <T, Args>(cb: (args: Args) => T, ms: number) => {
    const fn = useRef(debounce(cb, ms))

    useEffect(() => {
        fn.current = debounce(cb, ms)
    }, [cb])

    return useMemo(() => {
        return fn.current
    }, [])
}

export default useDebounce
