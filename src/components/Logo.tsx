import { cn } from "@/utils/utils";
import LocalImage from "./Image";

const Logo = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div className={cn(className, 'gradient-bg p-1 flex items-center justify-between rounded')}>
            <LocalImage className='header-logo' height='35px' image='LogoShadowWhiteOutline' />
        </div>
    );
}
export default Logo;