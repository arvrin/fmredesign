/**
 * Holiday & Event Data
 * Pre-populated list of major holidays for India + international.
 * Client-specific events (from content_events) take priority.
 */

import type { ContentEvent } from '../context/types';

export const INDIA_HOLIDAYS: ContentEvent[] = [
  { name: 'Republic Day', date: '2026-01-26', type: 'holiday' },
  { name: 'Vasant Panchami', date: '2026-02-01', type: 'holiday' },
  { name: 'Maha Shivaratri', date: '2026-02-27', type: 'holiday' },
  { name: 'Holi', date: '2026-03-14', type: 'holiday' },
  { name: 'Ugadi / Gudi Padwa', date: '2026-03-29', type: 'holiday' },
  { name: 'Ram Navami', date: '2026-04-06', type: 'holiday' },
  { name: 'Mahavir Jayanti', date: '2026-04-09', type: 'holiday' },
  { name: 'Good Friday', date: '2026-04-03', type: 'holiday' },
  { name: 'Eid ul-Fitr', date: '2026-03-20', type: 'holiday', notes: 'Date may vary' },
  { name: 'Buddha Purnima', date: '2026-05-12', type: 'holiday' },
  { name: 'Eid ul-Adha', date: '2026-05-27', type: 'holiday', notes: 'Date may vary' },
  { name: 'Rath Yatra', date: '2026-06-24', type: 'holiday' },
  { name: 'Independence Day', date: '2026-08-15', type: 'holiday' },
  { name: 'Raksha Bandhan', date: '2026-08-20', type: 'holiday' },
  { name: 'Janmashtami', date: '2026-08-31', type: 'holiday' },
  { name: 'Ganesh Chaturthi', date: '2026-09-09', type: 'holiday' },
  { name: 'Onam', date: '2026-09-11', type: 'holiday' },
  { name: 'Navratri Begins', date: '2026-09-28', type: 'holiday' },
  { name: 'Dussehra / Vijayadashami', date: '2026-10-07', type: 'holiday' },
  { name: 'Karva Chauth', date: '2026-10-16', type: 'holiday' },
  { name: 'Diwali', date: '2026-10-20', type: 'holiday' },
  { name: 'Bhai Dooj', date: '2026-10-22', type: 'holiday' },
  { name: 'Guru Nanak Jayanti', date: '2026-11-08', type: 'holiday' },
  { name: 'Christmas', date: '2026-12-25', type: 'holiday' },
];

export const INTERNATIONAL_EVENTS: ContentEvent[] = [
  { name: "New Year's Day", date: '2026-01-01', type: 'holiday' },
  { name: "Valentine's Day", date: '2026-02-14', type: 'holiday' },
  { name: "International Women's Day", date: '2026-03-08', type: 'holiday' },
  { name: 'Earth Day', date: '2026-04-22', type: 'holiday' },
  { name: "Mother's Day", date: '2026-05-10', type: 'holiday' },
  { name: 'World Environment Day', date: '2026-06-05', type: 'holiday' },
  { name: "International Yoga Day", date: '2026-06-21', type: 'holiday' },
  { name: "Father's Day", date: '2026-06-21', type: 'holiday' },
  { name: 'Friendship Day', date: '2026-08-02', type: 'holiday' },
  { name: "Teacher's Day (India)", date: '2026-09-05', type: 'holiday' },
  { name: 'World Mental Health Day', date: '2026-10-10', type: 'holiday' },
  { name: 'Halloween', date: '2026-10-31', type: 'holiday' },
  { name: 'Black Friday', date: '2026-11-27', type: 'holiday', notes: 'Major shopping event' },
  { name: 'Cyber Monday', date: '2026-11-30', type: 'holiday', notes: 'Online shopping event' },
  { name: "New Year's Eve", date: '2026-12-31', type: 'holiday' },
];

export const INDUSTRY_EVENTS: Record<string, ContentEvent[]> = {
  technology: [
    { name: 'World Technology Day', date: '2026-05-11', type: 'industry_event' },
    { name: 'World Telecommunication Day', date: '2026-05-17', type: 'industry_event' },
    { name: 'Data Privacy Day', date: '2026-01-28', type: 'industry_event' },
  ],
  healthcare: [
    { name: 'World Health Day', date: '2026-04-07', type: 'industry_event' },
    { name: 'World Cancer Day', date: '2026-02-04', type: 'industry_event' },
    { name: 'World Heart Day', date: '2026-09-29', type: 'industry_event' },
  ],
  education: [
    { name: 'World Education Day', date: '2026-01-24', type: 'industry_event' },
    { name: "Teacher's Day", date: '2026-09-05', type: 'industry_event' },
    { name: "Children's Day", date: '2026-11-14', type: 'industry_event' },
  ],
  ecommerce: [
    { name: 'Amazon Great Indian Sale (approx)', date: '2026-01-15', type: 'industry_event', notes: 'Major sale event' },
    { name: 'Flipkart Big Billion Days (approx)', date: '2026-10-01', type: 'industry_event', notes: 'Major sale event' },
  ],
  food_beverage: [
    { name: 'World Food Day', date: '2026-10-16', type: 'industry_event' },
    { name: 'International Coffee Day', date: '2026-10-01', type: 'industry_event' },
    { name: 'World Chocolate Day', date: '2026-07-07', type: 'industry_event' },
  ],
  real_estate: [
    { name: 'World Habitat Day', date: '2026-10-05', type: 'industry_event' },
  ],
  finance: [
    { name: 'Financial Literacy Day (India)', date: '2026-04-07', type: 'industry_event' },
    { name: 'Tax Filing Deadline', date: '2026-07-31', type: 'industry_event', notes: 'ITR filing deadline' },
  ],
};

export function getEventsForDateRange(
  start: string,
  end: string,
  industry?: string,
  clientEvents?: ContentEvent[]
): ContentEvent[] {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const allEvents: ContentEvent[] = [
    ...INDIA_HOLIDAYS,
    ...INTERNATIONAL_EVENTS,
    ...(industry && INDUSTRY_EVENTS[industry] ? INDUSTRY_EVENTS[industry] : []),
    ...(clientEvents || []),
  ];

  return allEvents.filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate >= startDate && eventDate <= endDate;
  });
}
