import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { MenuNav, MenuContainer, MenuItem } from "./styles";

const navigationLinks = [
    { label: "Home", path: ["/"], img: "/icons/icon-home.png" },
    { label: "Policies", path: ["/policies"], img: "/icons/icon-policies.png" },
    { label: "Stake", path: ["/stake"], img: "/icons/icon-safe.png" },
    { label: 'Bundles', path: ['/bundles'], img: '/icons/icon-bundles.png' },
];

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
