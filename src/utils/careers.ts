import { $fetch, $fetchNoCache } from "./fetch"
import { ASHBY_APIKEY } from "astro:env/server"

export const countryCodeToEmoji = (countryCode: string): string | null => {
    if (countryCode === undefined) {
        return null
    }

    let codePoints = countryCode
        .toUpperCase()
        .split("")
        .map((char) => 127397 + (char as any).charCodeAt())
    return String.fromCodePoint(...codePoints)
}


const headers = {
    accept: "application/json",
    "content-type": "application/json",
    authorization: `Basic ${ASHBY_APIKEY}`,
}

export const mapJob = (job: DoverJob): Job => {
    return {
        id: job.id,
        title: job.title,
        locations: job.locations
            ? job.locations.map((l) => {
                  if (l.location_option.display_name === "International") {
                      return {
                          code: "INTL",
                          name: "World",
                          emoji: "🌍",
                      }
                  }

                  if (l.location_option.display_name === "Europe") {
                      return {
                          code: "EU",
                          name: "Europe",
                          emoji: "🇪🇺",
                      }
                  }

                  return {
                      code: l.location_option.country ?? "UNKNOWN",
                      name: l.location_option.display_name,
                      emoji: countryCodeToEmoji(l.location_option.country) ?? "🌐",
                  }
              })
            : [],
        remote: job.locations
            ? job.locations.filter((l) => l.location_type === "REMOTE").length > 0
            : false,
        link: `https://app.dover.com/apply/Kestra%20Technologies/${job.id}`,
    }
}

export const fetchDepartment = async (): Promise<Department[]> => {
    return $fetchNoCache<{ results: Department[] }>(
        `https://api.ashbyhq.com/department.list`,
        {
            method: "POST",
            headers: headers,
        },
    ).then((r) => r.results)
}

export const fetchJobs = async (): Promise<AshbyJob[]> => {
    const departments = await fetchDepartment();

    const jobsList = await $fetchNoCache<{ results: AshbyJob[] }>(
        `https://api.ashbyhq.com/job.list`,
        {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                status: ["Open"],
                limit: 100,
                expand: ["location"],
                includeUnpublishedJobPostingsIds: false,
            }),
        },
    )

    return jobsList.results
        .map(value => {
            return {...value, department: departments.find(d => d.id === value.departmentId)}
        })
}


export const fetchJob = async (jobPostingId: string): Promise<AshbyJobPosting> => {
    const job = await $fetchNoCache<{ results: AshbyJobPosting }>(
        `https://api.ashbyhq.com/jobPosting.info`,
        {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                jobPostingId: jobPostingId,
                expand: ["job"],
            }),
        },
    )

    return job.results
}

interface DoverJob {
    id: string
    title: string
    locations?: Array<{
        location_type: string
        location_option: {
            country: string
            display_name: string
        }
    }>
}

interface Job {
    id: string
    title: string
    locations: Array<{
        code: string
        name: string
        emoji: string
    }>
    remote: boolean
    link: string
}

interface PostalAddress {
    postalCode: string
    addressRegion: string
    streetAddress: string
    addressCountry: string
    addressLocality: string
}

interface LocationAddress {
    postalAddress: PostalAddress
}

interface Location {
    id: string
    name: string
    externalName: string | null
    isArchived: boolean
    address: LocationAddress
    isRemote?: boolean
    workplaceType: string
    parentLocationId: string
    type: string
    extraData?: {
        partner_external_object_id?: string
        partner_additional_data?: string
    }
}

interface DescriptionPart {
    html: string | null
    plain: string | null
}

interface JobDescriptionParts {
    descriptionOpening: DescriptionPart
    descriptionBody: DescriptionPart
    descriptionClosing: DescriptionPart
}

interface JobLocationIds {
    primaryLocationId: string
    secondaryLocationIds: string[]
}

interface LinkedDataIdentifier {
    "@type": string
    name: string
    value: string
}

interface LinkedDataOrganization {
    "@type": string
    name: string
    sameAs: string
}

interface LinkedDataJobLocation {
    "@type": string
    address: {
        "@type": string
    }
}

interface JobLinkedData {
    "@context": string
    "@type": string
    title: string
    description: string
    identifier: LinkedDataIdentifier
    datePosted: string
    hiringOrganization: LinkedDataOrganization
    jobLocation: LinkedDataJobLocation
    employmentType: string
}

interface FormSelectableValue {
    label: string
    value: string
}

interface ApplicationFieldDefinition {
    id: string
    type: string
    path: string
    humanReadablePath: string
    title: string
    isNullable: boolean
    selectableValues: FormSelectableValue[]
}

interface ApplicationField {
    isRequired: boolean
    descriptionHtml: string
    descriptionPlain: string
    field: ApplicationFieldDefinition
}

interface ApplicationFormSection {
    title: string
    descriptionHtml: string
    descriptionPlain: string
    fields: ApplicationField[]
}

interface ApplicationFormDefinition {
    sections: ApplicationFormSection[]
}

interface SurveyForm {
    id: string
    organizationId: string
    title: string
    isArchived: boolean
    isDefaultForm: boolean
    formDefinition: ApplicationFormDefinition
    surveyType: string
}

interface JobPostingCompensationComponent {
    summary: string
    compensationType: string
    interval: string
    currencyCode?: string
    minValue: number | null
    maxValue: number | null
}

interface JobPostingCompensationTierComponent extends JobPostingCompensationComponent {
    id: string
}

interface JobPostingCompensationTier {
    id: string
    title: string
    additionalInformation?: string
    components: JobPostingCompensationTierComponent[]
    tierSummary: string
}

interface JobPostingCompensation {
    compensationTierSummary: string
    summaryComponents: JobPostingCompensationComponent[]
    compensationTiers: JobPostingCompensationTier[]
    shouldDisplayCompensationOnJobBoard: boolean
}

interface AshbyJobPosting {
    id: string
    title: string
    descriptionPlain: string
    descriptionHtml: string
    descriptionSocial: string
    descriptionParts: JobDescriptionParts
    departmentName: string
    teamName: string
    teamNameHierarchy: string[]
    jobId: string
    locationIds: JobLocationIds
    linkedData: JobLinkedData
    publishedDate: string
    applicationDeadline: string
    address: LocationAddress
    isRemote: boolean
    workplaceType: string
    employmentType: string
    applicationFormDefinition: ApplicationFormDefinition
    surveyFormDefinitions: SurveyForm[]
    isListed: boolean
    suppressDescriptionOpening: boolean
    suppressDescriptionClosing: boolean
    externalLink: string
    applyLink: string
    compensation: JobPostingCompensation
    updatedAt: string
    applicationLimitCalloutHtml: string
    job: AshbyJob
}

interface AshbyJob {
    id: string
    title: string
    employmentType: string
    locationId: string
    jobPostingIds: string[]
    departmentId: string
    department: Department | undefined
    location: Location
}

interface Department {
    id: string
    name: string
    externalName: string
}

export type { Job, DoverJob, AshbyJob, AshbyJobPosting }