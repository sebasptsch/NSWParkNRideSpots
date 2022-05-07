type Zone = {
    "spots": number,
    "zone_id": number,
    "occupancy": {
        "loop": number,
        "total": number,
        "monthlies": null,
        "open_gate": null,
        "transients": null
    },
    "zone_name": string,
    "parent_zone_id": number
}

type Occupancy = {
    "loop": number,
    "total": number,
    "monthlies": null,
    "open_gate": null,
    "transients": null
}

export type Locations = {
    [key: string]: string
}


export type ParkingData = {

    "tsn": number,
    "time": number,
    "spots": number,
    "zones": Zone[]
    "ParkID": number,
    "occupancy": Occupancy,
    "MessageDate": string,
    "facility_id": number,
    "facility_name": string,
    "tfnsw_facility_id": string

}