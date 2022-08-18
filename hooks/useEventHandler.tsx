import { Dispatch, RefObject, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';

const useEventHandler = (): [boolean, Dispatch<SetStateAction<boolean>>, RefObject<HTMLDivElement>] => {

    const ref = useRef<HTMLDivElement>(null);
    const [show, setShow] = useState(false);


    const handleClick = useCallback((e: MouseEvent) => {
        // @ts-expect-error
        if (ref.current && e.target && !ref.current.contains(e.target)) setShow(false)

    }, [ref.current])

    useEffect(() => {
        document.addEventListener('click', handleClick);

        return () => document.removeEventListener('click', handleClick)
    }, [])


    return [show, setShow, ref]

}

export default useEventHandler