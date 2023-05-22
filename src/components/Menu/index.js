import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { MenuNav, MenuContainer, MenuItem } from "./styles";
import { navigationLinks } from "../../utils/menulist";

export function Menu() {
    const router = useRouter();
    return (
        <MenuNav>
            <MenuContainer>
                {navigationLinks.map((link, index) => (
                    <MenuItem
                        key={index}
                        active={link.path.includes(router.pathname)}
                    >
                        <Link href={link.path[0]}>
                            <Image
                                src={link.img}
                                alt={link.label}
                                width={25}
                                height={25}
                            />
                            {link.label}
                        </Link>
                    </MenuItem>
                ))}
            </MenuContainer>
        </MenuNav>
    );
}
