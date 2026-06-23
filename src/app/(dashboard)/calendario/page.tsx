import { createClient } from '@/lib/supabase/server'
import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react'

export default async function CalendarioPage() {
  const supabase = await createClient()

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('event_date')

  const futureEvents = events?.filter(
    (e) => new Date(e.event_date) >= new Date()
  ) || []
  const pastEvents = events?.filter(
    (e) => new Date(e.event_date) < new Date()
  ) || []

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Calendário</h1>
        <p className="text-white/40">Acompanhe todos os eventos e aulas ao vivo</p>
      </div>

      {/* Upcoming events */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Próximos Eventos
        </h2>

        {futureEvents.length > 0 ? (
          <div className="space-y-4">
            {futureEvents.map((event) => {
              const date = new Date(event.event_date)
              return (
                <div key={event.id} className="card-glass p-6 flex items-start gap-6 hover:border-wine-500/20 transition-colors">
                  <div className="w-16 h-16 rounded-2xl bg-wine-500/10 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-wine-400 text-xs font-bold uppercase">
                      {date.toLocaleDateString('pt-BR', { month: 'short' })}
                    </span>
                    <span className="text-white text-2xl font-bold leading-none">
                      {date.getDate()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-2">{event.title}</h3>
                    {event.description && (
                      <p className="text-white/40 text-sm mb-3">{event.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-white/30 text-sm">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <CalendarIcon className="w-4 h-4" />
                        {date.toLocaleDateString('pt-BR', { weekday: 'long' })}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="card-glass p-8 text-center">
            <CalendarIcon className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/30">Nenhum evento programado</p>
          </div>
        )}
      </div>

      {/* Past events */}
      {pastEvents.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white/50 mb-4">Eventos Passados</h2>
          <div className="space-y-3 opacity-60">
            {pastEvents.slice(-5).map((event) => {
              const date = new Date(event.event_date)
              return (
                <div key={event.id} className="card-glass p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-white/30 text-[10px] font-bold uppercase">
                      {date.toLocaleDateString('pt-BR', { month: 'short' })}
                    </span>
                    <span className="text-white/50 text-sm font-bold leading-none">
                      {date.getDate()}
                    </span>
                  </div>
                  <p className="text-white/40 text-sm">{event.title}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
