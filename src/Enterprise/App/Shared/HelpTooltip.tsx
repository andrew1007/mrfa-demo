import { Tooltip } from "@mui/material"
import HelpIcon from '@mui/icons-material/Help';

const HelpToolTip = ({ desc }: { desc: string }) => {
    return (
        <Tooltip title={desc} placement="top">
            <HelpIcon className="help-icon" />
        </Tooltip>
    )
}

export default HelpToolTip