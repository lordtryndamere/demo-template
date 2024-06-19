# Reservations-microservice-producer   (By MagicIdeas)

## Descripción

El microservicio de reservaciones es parte de una aplicación más grande destinada a proporcionar planes y actividades dentro de una ciudad para individuos y grupos, basándose en un presupuesto determinado. Este microservicio maneja todas las operaciones relacionadas con las reservas, integrándose con otros microservicios para gestionar usuarios y planes.

## Características

- **CQRS**: Command Query Responsibility Segregation para separar las operaciones de lectura y escritura.
- **DDD**: Domain-Driven Design para un diseño de dominio estructurado y mantenible.
- **Integración con RabbitMQ**: Comunicación asíncrona entre microservicios.
- **Conexión a MariaDB**: Base de datos relacional alojada en AWS RDS.

## Requisitos Previos

- Docker y Docker Compose instalados.
- Node.js y npm instalados.
- AWS RDS configurado con MariaDB.
- RabbitMQ configurado.

## Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto y configura las siguientes variables de entorno:

```env
# Configuración de PostgreSQL
DB_HOST=your-rds-endpoint.amazonaws.com
DB_PORT=3306
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

# Configuración de RabbitMQ
RABBITMQ_URL=amqp://user:password@localhost:5672


