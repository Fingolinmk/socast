"use client"
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { useRouter, usePathname } from "next/navigation";


export default function Layout({ children }) {

    const router = useRouter();
    const currentRoute = usePathname()
    const defaultActiveKey = currentRoute.split("/")[2] // todo remove magic number bs
    const items: TabsProps['items'] = [
        {
            key: 'user',
            label: 'User',
        },
        {
            key: 'podcast',
            label: 'Podcast',
        },
        {
            key: 'sonos',
            label: 'Sonos',
        },
    ];

    const onChange = (key: string) => {
        router.push(`/start/${key}`);

    };
    return (
        <>
            <Tabs defaultActiveKey={defaultActiveKey} items={items} onChange={onChange} />
            <div />
            {children}
            < div />
        </>
    )
}