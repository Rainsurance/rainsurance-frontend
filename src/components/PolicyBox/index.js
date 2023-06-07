
import {
    ContainerItemTop,
    ContainerItem,
    ContainerBody,
    ContainerCalendar,
    ContainerRain,
    ContainerCoin,
    ContainerBodyItem,
    Status,
    EnvStatus,
    EnvStatusWrap,
} from "@/styles/policies";

import IconPlane from '../../../public/icons/icon-plane-black.png';
import IconTooltip from '../../../public/icons/tooltip-black.png';
import IconRain from '../../../public/icons/icon-rain-black.png';
import IconCalendar from '../../../public/icons/icon-calendar-black.png';
import IconCoin from '../../../public/icons/coin-black.png';

import Image from "next/image";
import Link from "next/link";

const PolicyBox = ({item, confirmationDialog, handleOpenModal}) => {
    const filterCanceled = 'invert(28%) sepia(13%) saturate(286%) hue-rotate(177deg) brightness(96%) contrast(88%)';
    const filterActive = 'invert(74%) sepia(21%) saturate(6086%) hue-rotate(180deg) brightness(98%) contrast(103%)';
    const colorCanceled = '#4b4f55';
    const colorActive = '#3c67a4';
    const bgCanceled = '#b4bcc6';
    const bgActive = '#fff';

    return (
        <ContainerItem style={ item.style.canceled ? { background: bgCanceled } : { background: bgActive }}>
            <ContainerItemTop>
                <h3 style={ item.style.canceled ? { color: colorCanceled } : { color: colorActive }}> 
                    <Image
                        style={ item.style.canceled ? {filter: filterCanceled} : {filter: filterActive}}
                        src={IconPlane}
                        width={19}
                        height={19}
                        alt="IconPlane"
                    />
                    { item.city.name }
                </h3>
                <EnvStatus>
                    { item.style.label && (
                        <EnvStatusWrap>
                            <Status
                                content={ `'${item.style.label}'` }
                                color={ item.style.color }
                            />
                            { item.style.filter && 
                                <Image
                                    style={{
                                        filter: item.style.filter,
                                    }}
                                    src={IconTooltip}
                                    width={13}
                                    height={13}
                                    alt="See details"
                                    onClick={() => handleOpenModal(item)}
                                />
                            }
                        </EnvStatusWrap>)
                    }
                    {item.style.processable && (
                        <Link
                            href=""
                            onClick={() =>
                                confirmationDialog(
                                    "Process confirmation",
                                    "Are you sure you want to check the weather for this policy?",
                                    item,
                                    "process"
                                )
                            }
                        >
                            Process
                        </Link>
                    )}
                    {item.style.claimable && (
                        <Link
                            href=""
                            onClick={() =>
                                confirmationDialog(
                                    "Claim confirmation",
                                    "Are you sure you want to claim this policy?",
                                    item,
                                    "claim"
                                )
                            }
                        >
                            Claim
                        </Link>
                    )}
                </EnvStatus>
            </ContainerItemTop>
            <ContainerBody>
                <ContainerBodyItem>
                    <ContainerCalendar>
                        <Image
                            //TODO
                            style={{
                                filter: 'invert(74%) sepia(21%) saturate(6086%) hue-rotate(180deg) brightness(98%) contrast(103%)',
                            }}
                            src={IconCalendar}
                            width={30}
                            height={30}
                            alt="Period"
                        />
                        <p>
                            { item.startDate } <br />
                            { item.endDate }
                        </p>
                    </ContainerCalendar>
                    <ContainerRain>
                        <Image
                            //TODO
                            style={{
                                filter: 'invert(74%) sepia(21%) saturate(6086%) hue-rotate(180deg) brightness(98%) contrast(103%)',
                            }}
                            src={IconRain}
                            width={25}
                            height={25}
                            alt="Average Precipitation"
                        />
                        <p>{ item.avgPrec } mm</p>
                    </ContainerRain>
                    <ContainerCoin>
                        <Image
                            //TODO
                            style={{
                                filter: 'invert(74%) sepia(21%) saturate(6086%) hue-rotate(180deg) brightness(98%) contrast(103%)',
                            }}
                            src={IconCoin}
                            width={25}
                            height={25}
                            alt="Premium/Insured"
                        />
                        <p>{ item.sumInsuredUSD }</p>
                    </ContainerCoin>
                </ContainerBodyItem>
            </ContainerBody>
        </ContainerItem>
    );
}

export default PolicyBox;
  