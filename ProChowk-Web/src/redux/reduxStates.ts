import { useAppSelector } from "../utils/hooks"

export const useSettingsStates = ()=>{
    const {colorMode} = useAppSelector((state)=>state.settings)
    return {colorMode}
}