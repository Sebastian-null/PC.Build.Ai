"use client";
import type{ReactNode,MouseEvent}from"react";import{useRouter}from"@/shared/i18n/navigation";
export function RouteModalFrame({children}:{children:ReactNode}){const router=useRouter();function backdrop(event:MouseEvent<HTMLDivElement>){if(event.target===event.currentTarget)router.back()}return <div className="route-modal-backdrop" onMouseDown={backdrop} role="presentation"><div className="route-modal-window" role="dialog" aria-modal="true"><button className="route-modal-close" onClick={()=>router.back()} aria-label="Close">×</button>{children}</div></div>}
