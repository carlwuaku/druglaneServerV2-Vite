import * as Images from "@/assets"

interface ImageProps {
    image: keyof typeof Images;
    height: string;
    className?: string;
}

const LocalImage = ({ image, height, className }: ImageProps) => {
    return <img src={Images[image]} className={className} alt="none" height={height} />
}

export default LocalImage