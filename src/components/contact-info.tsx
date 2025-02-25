import { MapPin, Phone, Mail, Clock } from "lucide-react"

export function ContactInfo() {
  return (
    <div className="space-y-8 lg:sticky lg:top-24">
      <div>
        <h2 className="text-2xl font-semibold mb-6">Informações de Contato</h2>
        <div className="space-y-6">
          <div className="flex gap-4">
            <MapPin className="h-6 w-6 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-medium mb-1">Endereço</h3>
              <p className="text-muted-foreground">
                Rua dos Pinheiros, 1673
                <br />
                Pinheiros - São Paulo, SP
                <br />
                05422-012
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Phone className="h-6 w-6 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-medium mb-1">Telefone</h3>
              <p className="text-muted-foreground">
                <a href="tel:+551193502-5003" className="hover:text-primary transition-colors">
                  (11) 93502-5003
                </a>
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Mail className="h-6 w-6 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-medium mb-1">E-mail</h3>
              <p className="text-muted-foreground">
                <a href="mailto:contato@jhonnathan.com.br" className="hover:text-primary transition-colors">
                  contato@jhonnathan.com.br
                </a>
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Clock className="h-6 w-6 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-medium mb-1">Horário de Atendimento</h3>
              <p className="text-muted-foreground">
                Segunda a Sexta: 9h às 18h
                <br />
                Sábado: 9h às 13h
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted p-6 rounded-lg">
        <h3 className="font-semibold mb-2">Atendimento Especializado</h3>
        <p className="text-muted-foreground text-sm">
          Nossa equipe de especialistas está pronta para oferecer um atendimento personalizado e ajudar você a tomar a
          melhor decisão para seu investimento imobiliário.
        </p>
      </div>
    </div>
  )
}

