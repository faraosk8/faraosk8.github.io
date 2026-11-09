export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      cliques_indicacoes: {
        Row: {
          created_at: string
          id: string
          origem: string | null
          pagina: string
          produto_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          origem?: string | null
          pagina: string
          produto_id: string
        }
        Update: {
          created_at?: string
          id?: string
          origem?: string | null
          pagina?: string
          produto_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cliques_indicacoes_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos_indicados"
            referencedColumns: ["id"]
          },
        ]
      }
      inscricoes_olhar_cuidado: {
        Row: {
          autorizacao_responsavel: boolean
          bairro: string
          cidade: string
          consentimento_lgpd: boolean
          contato_alternativo: string | null
          created_at: string
          declaracao_beneficiario: boolean
          email: string | null
          id: string
          idade: number
          melhor_horario: string | null
          motivo: string
          nome: string
          nome_responsavel: string | null
          preferencia_contato: string | null
          programa_outro: string | null
          programas_sociais: string[]
          status: string
          telefone: string
          telefone_responsavel: string | null
          via_programa_social: boolean
          via_vulnerabilidade: boolean
        }
        Insert: {
          autorizacao_responsavel?: boolean
          bairro: string
          cidade: string
          consentimento_lgpd: boolean
          contato_alternativo?: string | null
          created_at?: string
          declaracao_beneficiario?: boolean
          email?: string | null
          id?: string
          idade: number
          melhor_horario?: string | null
          motivo: string
          nome: string
          nome_responsavel?: string | null
          preferencia_contato?: string | null
          programa_outro?: string | null
          programas_sociais?: string[]
          status?: string
          telefone: string
          telefone_responsavel?: string | null
          via_programa_social?: boolean
          via_vulnerabilidade?: boolean
        }
        Update: {
          autorizacao_responsavel?: boolean
          bairro?: string
          cidade?: string
          consentimento_lgpd?: boolean
          contato_alternativo?: string | null
          created_at?: string
          declaracao_beneficiario?: boolean
          email?: string | null
          id?: string
          idade?: number
          melhor_horario?: string | null
          motivo?: string
          nome?: string
          nome_responsavel?: string | null
          preferencia_contato?: string | null
          programa_outro?: string | null
          programas_sociais?: string[]
          status?: string
          telefone?: string
          telefone_responsavel?: string | null
          via_programa_social?: boolean
          via_vulnerabilidade?: boolean
        }
        Relationships: []
      }
      inscricoes_olhar_cuidado_rate_limits: {
        Row: {
          chave_hash: string
          janela_inicio: string
          quantidade: number
        }
        Insert: {
          chave_hash: string
          janela_inicio: string
          quantidade?: number
        }
        Update: {
          chave_hash?: string
          janela_inicio?: string
          quantidade?: number
        }
        Relationships: []
      }
      posts: {
        Row: {
          category: string | null
          content: string
          cover_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          published: boolean
          published_at: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content: string
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: string
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      produtos_indicados: {
        Row: {
          ativo: boolean
          categoria: string
          created_at: string
          cupom: string | null
          cupom_validade: string | null
          destaque_home: boolean
          favorito: boolean
          id: string
          imagem_url: string | null
          link_afiliado: string
          loja: string
          loja_outra_nome: string | null
          necessidades: string[]
          nome: string
          ordem: number
          por_que_indico: string
          preco: number | null
          preco_anterior: number | null
          preco_verificado_em: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          categoria: string
          created_at?: string
          cupom?: string | null
          cupom_validade?: string | null
          destaque_home?: boolean
          favorito?: boolean
          id?: string
          imagem_url?: string | null
          link_afiliado: string
          loja: string
          loja_outra_nome?: string | null
          necessidades?: string[]
          nome: string
          ordem?: number
          por_que_indico?: string
          preco?: number | null
          preco_anterior?: number | null
          preco_verificado_em?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          categoria?: string
          created_at?: string
          cupom?: string | null
          cupom_validade?: string | null
          destaque_home?: boolean
          favorito?: boolean
          id?: string
          imagem_url?: string | null
          link_afiliado?: string
          loja?: string
          loja_outra_nome?: string | null
          necessidades?: string[]
          nome?: string
          ordem?: number
          por_que_indico?: string
          preco?: number | null
          preco_anterior?: number | null
          preco_verificado_em?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      consumir_limite_olhar_cuidado: {
        Args: { p_chave_hash: string; p_limite?: number }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
