<template>
    <article class="changelog-entry" :class="{ major: entry.isMajor }">
        <time class="entry-date" :datetime="entry.publishedAt">
            <span class="day">{{ day }}</span>
            <span class="year">{{ year }}</span>
        </time>

        <div class="entry-rail" aria-hidden="true">
            <span class="entry-dot" />
        </div>

        <div class="entry-body">
            <div class="entry-heading">
                <h2 class="entry-version">
                    <a :href="`/docs/changelog/${entry.tag}`">{{ entry.title }}</a>
                </h2>
                <span class="badge" :class="entry.isMajor ? 'badge-major' : 'badge-minor'">
                    {{ entry.isMajor ? "Major" : "Minor" }}
                </span>
            </div>

            <p class="entry-summary">{{ entry.summary }}</p>

            <div v-for="edition in entry.editions" :key="edition.label ?? 'default'" class="entry-edition">
                <h3 v-if="edition.label" class="edition-label">{{ edition.label }}</h3>

                <ChangelogChangeGroup
                    v-for="group in edition.groups"
                    :key="`${edition.label ?? ''}-${group.id}`"
                    :group="group"
                    :default-open="openGroups.includes(group.id)"
                />
            </div>

            <p v-if="entry.totalChanges === 0" class="entry-empty">
                No itemized changes —
                <a :href="entry.githubUrl" target="_blank" rel="noopener noreferrer">
                    read the release notes on GitHub
                </a>.
            </p>
        </div>
    </article>
</template>

<script lang="ts" setup>
    import { computed } from "vue"
    import ChangelogChangeGroup from "./ChangelogChangeGroup.vue"
    import type { ChangelogEntry } from "~/utils/changelog/parseRelease"

    const props = withDefaults(
        defineProps<{
            entry: ChangelogEntry
            /** Group ids to render expanded, used to open the latest release. */
            openGroups?: string[]
        }>(),
        { openGroups: () => [] },
    )

    const publishedAt = computed(() => new Date(props.entry.publishedAt))

    const day = computed(() =>
        publishedAt.value.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        }),
    )

    const year = computed(() => publishedAt.value.getFullYear())
</script>

<style lang="scss" scoped>
    .changelog-entry {
        display: grid;
        grid-template-columns: 5rem 1.5rem minmax(0, 1fr);
        column-gap: 1rem;

        @include media-breakpoint-down(md) {
            grid-template-columns: 1rem minmax(0, 1fr);
            column-gap: 0.75rem;
        }
    }

    .entry-date {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        line-height: 1.2;

        .day {
            color: var(--ks-content-primary);
            font-size: 1rem;
            font-weight: 600;
        }

        .year {
            color: var(--ks-content-tertiary);
            font-size: 0.8125rem;
        }

        @include media-breakpoint-down(md) {
            grid-column: 2;
            flex-direction: row;
            align-items: baseline;
            justify-content: flex-start;
            gap: 0.375rem;
            margin-bottom: 0.5rem;
        }
    }

    .entry-rail {
        position: relative;
        display: flex;
        justify-content: center;

        &::before {
            content: "";
            position: absolute;
            top: 0;
            bottom: 0;
            width: 1px;
            background: var(--ks-border-primary);
        }

        @include media-breakpoint-down(md) {
            grid-column: 1;
            grid-row: 1 / -1;
        }
    }

    .changelog-entry:last-child .entry-rail::before {
        bottom: auto;
        height: 0.875rem;
    }

    .entry-dot {
        position: relative;
        width: 10px;
        height: 10px;
        margin-top: 0.375rem;
        border: 1px solid var(--ks-border-secondary);
        border-radius: 50%;
        background: var(--ks-background-body);
    }

    .major .entry-dot {
        border-color: var(--ks-border-active);
        background: var(--ks-border-active);
        box-shadow: 0 0 0 4px var(--ks-background-tag-category);
    }

    .entry-body {
        padding-bottom: 3.5rem;

        @include media-breakpoint-down(md) {
            grid-column: 2;
        }
    }

    .entry-heading {
        display: flex;
        align-items: center;
        gap: 0.625rem;
    }

    .entry-version {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
        line-height: inherit;

        a {
            color: var(--ks-content-primary);
            text-decoration: none;

            &:hover {
                color: var(--ks-content-link);
            }
        }
    }

    .badge {
        border-radius: $border-radius;
        font-size: 0.625rem;
        font-weight: 500;
        letter-spacing: 0.4px;
        padding: 0.125rem 0.375rem;
        text-transform: uppercase;

        &-major {
            border: 1px solid var(--ks-border-alert-success);
            background: var(--ks-background-tag-success);
            color: var(--ks-content-tag-success);
        }

        &-minor {
            border: 1px solid var(--ks-border-active);
            background: var(--ks-background-tag-category);
            color: var(--ks-content-tag-category);
        }
    }

    .entry-summary {
        margin: 0.75rem 0 1rem;
        color: var(--ks-content-primary);
        font-size: 1rem;
        font-weight: 600;
    }

    .entry-edition {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .entry-edition + .entry-edition {
        margin-top: 1.5rem;
    }

    .edition-label {
        margin: 0;
        color: var(--ks-content-secondary);
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.4px;
        text-transform: uppercase;
    }

    .entry-empty {
        margin: 0;
        color: var(--ks-content-secondary);
        font-size: 0.875rem;

        a {
            color: var(--ks-content-link);
        }
    }
</style>
