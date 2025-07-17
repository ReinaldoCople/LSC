from flask import Blueprint, request, jsonify
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from datetime import datetime

contact_bp = Blueprint('contact', __name__)

@contact_bp.route('/api/contact', methods=['POST'])
def send_contact_email():
    try:
        # Obter dados do formulário
        data = request.get_json()
        
        nome = data.get('nome', '').strip()
        email = data.get('email', '').strip()
        telefone = data.get('telefone', '').strip()
        servico = data.get('servico', '').strip()
        mensagem = data.get('mensagem', '').strip()
        
        # Validação básica
        if not nome or not email or not mensagem:
            return jsonify({
                'success': False,
                'message': 'Nome, e-mail e mensagem são obrigatórios.'
            }), 400
        
        # Configurações de e-mail (você pode configurar via variáveis de ambiente)
        SMTP_SERVER = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        SMTP_PORT = int(os.getenv('SMTP_PORT', '587'))
        EMAIL_USER = os.getenv('EMAIL_USER', 'contato@lsctech.com.br')
        EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD', '')  # Senha de app do Gmail
        
        # E-mail de destino
        DESTINATION_EMAIL = os.getenv('DESTINATION_EMAIL', 'contato@lsctech.com.br')
        
        # Criar mensagem de e-mail
        msg = MIMEMultipart()
        msg['From'] = EMAIL_USER
        msg['To'] = DESTINATION_EMAIL
        msg['Subject'] = f'Novo contato do site - {nome}'
        
        # Mapear serviços para nomes mais legíveis
        servicos_map = {
            'painel-led': 'Painéis de LED',
            'projecao': 'Projeção HD',
            'iluminacao': 'Iluminação',
            'som': 'Sistemas de Som',
            'tela-interativa': 'Telas Interativas',
            'completo': 'Pacote Completo'
        }
        
        servico_nome = servicos_map.get(servico, servico)
        
        # Corpo do e-mail
        body = f"""
        Nova mensagem de contato recebida através do site LSC Tech:
        
        Nome: {nome}
        E-mail: {email}
        Telefone: {telefone if telefone else 'Não informado'}
        Serviço de interesse: {servico_nome if servico_nome else 'Não especificado'}
        
        Mensagem:
        {mensagem}
        
        ---
        Data/Hora: {datetime.now().strftime('%d/%m/%Y às %H:%M:%S')}
        IP do remetente: {request.remote_addr}
        """
        
        msg.attach(MIMEText(body, 'plain', 'utf-8'))
        
        # Enviar e-mail
        if EMAIL_PASSWORD:  # Só tenta enviar se tiver senha configurada
            try:
                server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
                server.starttls()
                server.login(EMAIL_USER, EMAIL_PASSWORD)
                text = msg.as_string()
                server.sendmail(EMAIL_USER, DESTINATION_EMAIL, text)
                server.quit()
                
                return jsonify({
                    'success': True,
                    'message': 'Mensagem enviada com sucesso! Entraremos em contato em breve.'
                })
            except Exception as e:
                print(f"Erro ao enviar e-mail: {str(e)}")
                return jsonify({
                    'success': False,
                    'message': 'Erro interno do servidor. Tente novamente mais tarde.'
                }), 500
        else:
            # Modo de desenvolvimento - apenas log
            print("=== FORMULÁRIO DE CONTATO (MODO DESENVOLVIMENTO) ===")
            print(f"Nome: {nome}")
            print(f"E-mail: {email}")
            print(f"Telefone: {telefone}")
            print(f"Serviço: {servico_nome}")
            print(f"Mensagem: {mensagem}")
            print("=" * 50)
            
            return jsonify({
                'success': True,
                'message': 'Mensagem recebida! (Modo desenvolvimento - verifique o console)'
            })
            
    except Exception as e:
        print(f"Erro no processamento do formulário: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Erro interno do servidor. Tente novamente mais tarde.'
        }), 500

@contact_bp.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'ok',
        'message': 'API de contato funcionando'
    })

