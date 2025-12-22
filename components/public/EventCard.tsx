'use client';

import { useState } from 'react';
import { Calendar, BookOpen, Users, Star, Clock, MapPin, UserPlus } from 'lucide-react';
import { RSVPModal } from './RSVPModal';

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string | null;
    eventType: string;
    startDate: string;
    endDate: string | null;
    startTime: string | null;
    endTime: string | null;
    location: string | null;
    allowRSVP: boolean;
    maxAttendees: number | null;
    rsvpCount: number;
  };
}

const eventTypeLabels: Record<string, string> = {
  CLASS: 'Lớp Học',
  TNTT: 'TNTT',
  HOLIDAY: 'Nghỉ Lễ',
  SPECIAL_EVENT: 'Sự Kiện Đặc Biệt',
  MASS: 'Thánh Lễ',
  MEETING: 'Họp',
};

const eventTypeColors: Record<string, string> = {
  CLASS: 'bg-blue-100 text-blue-800 border-blue-300',
  TNTT: 'bg-green-100 text-green-800 border-green-300',
  HOLIDAY: 'bg-red-100 text-red-800 border-red-300',
  SPECIAL_EVENT: 'bg-purple-100 text-purple-800 border-purple-300',
  MASS: 'bg-amber-100 text-amber-800 border-amber-300',
  MEETING: 'bg-gray-100 text-gray-800 border-gray-300',
};

const EventIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'CLASS':
      return <BookOpen className="h-5 w-5" />;
    case 'TNTT':
      return <Users className="h-5 w-5" />;
    case 'HOLIDAY':
      return <Clock className="h-5 w-5" />;
    case 'SPECIAL_EVENT':
      return <Star className="h-5 w-5" />;
    case 'MASS':
      return (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    case 'MEETING':
      return (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    default:
      return <Calendar className="h-5 w-5" />;
  }
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

function formatTimeRange(startTime?: string | null, endTime?: string | null) {
  if (!startTime) return null;
  if (endTime) return `${startTime} - ${endTime}`;
  return startTime;
}

export function EventCard({ event }: EventCardProps) {
  const [showRSVPModal, setShowRSVPModal] = useState(false);

  const startDate = new Date(event.startDate);
  const endDate = event.endDate ? new Date(event.endDate) : null;

  return (
    <>
      <article
        className={`group rounded-xl border-2 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-lg ${eventTypeColors[event.eventType]}`}
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow">
              <EventIcon type={event.eventType} />
            </div>
          </div>

          {/* Event Details */}
          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
              <div>
                <span className="mb-1 inline-block rounded-full bg-white/80 px-2 py-0.5 text-xs font-medium">
                  {eventTypeLabels[event.eventType]}
                </span>
                <h4 className="font-serif text-xl font-bold text-gray-900">
                  {event.title}
                </h4>
              </div>
              {formatTimeRange(event.startTime, event.endTime) && (
                <span className="rounded-full bg-white px-3 py-1 text-sm font-medium shadow">
                  {formatTimeRange(event.startTime, event.endTime)}
                </span>
              )}
            </div>

            <p className="mb-2 text-sm font-medium text-gray-700">
              {formatDate(event.startDate)}
              {endDate && endDate.toDateString() !== startDate.toDateString() && (
                <> - {formatDate(event.endDate!)}</>
              )}
            </p>

            {event.location && (
              <p className="mb-2 flex items-center gap-1 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                {event.location}
              </p>
            )}

            {event.description && (
              <p className="text-sm text-gray-600">
                {event.description}
              </p>
            )}

            {/* RSVP Section */}
            {event.allowRSVP && (
              <div className="mt-4 flex items-center gap-4">
                <button
                  onClick={() => setShowRSVPModal(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-900/90"
                >
                  <UserPlus className="h-4 w-4" />
                  Đăng ký tham dự
                </button>
                {event.maxAttendees && (
                  <span className="text-sm text-gray-600">
                    {event.rsvpCount}/{event.maxAttendees} đã đăng ký
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </article>

      {/* RSVP Modal */}
      {showRSVPModal && (
        <RSVPModal
          eventId={event.id}
          eventTitle={event.title}
          eventDate={formatDate(event.startDate)}
          maxAttendees={event.maxAttendees}
          currentCount={event.rsvpCount}
          onClose={() => setShowRSVPModal(false)}
        />
      )}
    </>
  );
}
