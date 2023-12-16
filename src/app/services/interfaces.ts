/*
Make interfcaes / data types availble globally
*/

export interface CertifcatePhoto {
    filepath: string;
    webviewPath?: string;
}

export interface cpdEvent {
    id : number,
    title : string,
    description: string,
    hours: number,
    startdate: Date,
    endDate: Date,
    eventOrganisers: string,
    CPDPoints: number,
    compentancyCat: string,
    reflection: string,
    learningPlan: string,
    certificate: string
}
