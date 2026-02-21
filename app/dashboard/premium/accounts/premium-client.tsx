'use client'

import { useLanguage } from '@/lib/language-context'
import { Card } from '@/components/ui/card'
import { Key, Shield, Clock, AlertCircle } from 'lucide-react'
import { PremiumRequestButton } from '@/components/premium-request-button'
import { CopyButton } from '@/components/copy-button'

interface AccountData {
    id: string
    serviceName: string
    type: string
    notes?: string | null
}

interface RequestData {
    id: string
    resourceName: string
    status: string
    adminNotes?: string | null
    createdAt: string
}

export function PremiumClient({ accounts, requests, pendingResourceNames }: {
    accounts: AccountData[]
    requests: RequestData[]
    pendingResourceNames: string[]
}) {
    const { t, language } = useLanguage()
    const locale = language === 'bn' ? 'bn-BD' : 'en-US'
    const pendingRequests = new Set(pendingResourceNames)

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{t('premiumPage.title')}</h2>
                <p className="text-muted-foreground">{t('premiumPage.subtitle')}</p>
            </div>

            <div className="grid md-tab:grid-cols-2 lg:grid-cols-3 gap-4 sm-std:gap-6 md:gap-8">
                {/* Available Resources */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="font-bold text-xl flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        {t('premiumPage.availableServices')}
                    </h3>

                    <div className="grid sm-tab:grid-cols-2 gap-4">
                        {accounts.length > 0 ? (
                            accounts.map((account) => (
                                <Card key={account.id} className="p-4 sm-std:p-6 hover:shadow-lg transition-all border-2 border-transparent hover:border-primary/20 group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                                            <Key className="w-6 h-6" />
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${account.type === 'PRIVATE' ? 'bg-purple-500/10 text-purple-600 border-purple-200' : 'bg-blue-500/10 text-blue-600 border-blue-200'
                                            }`}>
                                            {account.type} Access
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{account.serviceName}</h4>
                                    <p className="text-xs text-muted-foreground mb-6 pr-10">{account.notes || t('premiumPage.premiumAccess')}</p>

                                    <PremiumRequestButton
                                        resourceId={account.id}
                                        resourceType="PREMIUM_ACCOUNT"
                                        resourceName={account.serviceName}
                                        isPending={pendingRequests.has(account.serviceName)}
                                    />
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-2 p-12 text-center border-2 border-dashed rounded-2xl bg-muted/20">
                                <Key className="w-12 h-12 text-muted/30 mx-auto mb-4" />
                                <p className="text-muted-foreground font-medium">{t('premiumPage.noAccounts')}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Request Status */}
                <div className="space-y-6">
                    <h3 className="font-bold text-xl flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        {t('premiumPage.requestList')}
                    </h3>
                    <div className="space-y-3">
                        {requests.length > 0 ? (
                            requests.map((request) => (
                                <Card key={request.id} className="p-4 space-y-3 overflow-hidden">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h5 className="font-bold text-sm tracking-tight uppercase">{request.resourceName}</h5>
                                            <p className="text-[10px] text-muted-foreground font-bold">{new Date(request.createdAt).toLocaleDateString(locale)}</p>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${request.status === 'APPROVED' ? 'bg-green-500 text-white' :
                                            request.status === 'PENDING' ? 'bg-orange-500 text-white' : 'bg-red-500 text-white'
                                            }`}>
                                            {request.status}
                                        </span>
                                    </div>
                                    {request.status === 'APPROVED' && request.adminNotes && (
                                        <div className="mt-2 space-y-2">
                                            <div className="p-3 bg-green-50 border border-green-100 rounded-lg relative group/item">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="text-[10px] font-bold text-green-700 uppercase opacity-70 tracking-wider">Access Details</p>
                                                    <CopyButton text={request.adminNotes} />
                                                </div>
                                                <p className="text-xs font-mono font-bold text-green-900 break-all leading-relaxed whitespace-pre-wrap">
                                                    {request.adminNotes}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {request.status === 'REJECTED' && request.adminNotes && (
                                        <div className="p-2.5 bg-red-50 border border-red-100 rounded text-[10px] text-red-700 font-medium">
                                            <span className="font-bold">{t('premiumPage.reason')}:</span> {request.adminNotes}
                                        </div>
                                    )}
                                </Card>
                            ))
                        ) : (
                            <div className="p-8 text-center border-2 border-dashed rounded-xl bg-muted/10">
                                <p className="text-xs text-muted-foreground font-bold uppercase italic tracking-widest">{t('premiumPage.noRequests')}</p>
                            </div>
                        )}
                    </div>

                    <Card className="p-6 bg-primary text-primary-foreground space-y-4 border-none shadow-xl shadow-primary/20">
                        <h4 className="font-bold flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 animate-pulse" />
                            {t('premiumPage.usageRules')}
                        </h4>
                        <ul className="text-xs space-y-3 list-disc pl-4 opacity-90 font-medium leading-relaxed">
                            <li>{t('premiumPage.rule1')}</li>
                            <li>{t('premiumPage.rule2')}</li>
                            <li>{t('premiumPage.rule3')}</li>
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    )
}
