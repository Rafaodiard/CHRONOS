namespace EscapeRoom.Models;
using Dapper;
using Microsoft.Data.SqlClient;
using System.Text.Json;
using EscapeRoom.Models;


    public static class DB 
    { 
        private static string _connectionString =
        //@"Server=localhost;Database=SalaEscape;Integrated Security=True;TrustServerCertificate=True";
        @"Server=.\SQLEXPRESS;Database=SalaEscape;Integrated Security=True;TrustServerCertificate=True;";

        public static Usuarios? Login(LogInViewModel l)
        {
            using(SqlConnection connection = new SqlConnection(_connectionString))
            {
                string query = @"SELECT * 
                                FROM Usuarios
                                WHERE Usuario = @usuario
                                AND Password = @password";

                return connection.QueryFirstOrDefault<Usuarios?>(
                    query,
                    new
                    {
                        usuario = l.usuario,
                        password = l.password
                    });
            }
        }
        public static bool UsuarioExiste(string usuario)
        {
            using(SqlConnection connection = new SqlConnection(_connectionString))
            {
                string query = @"SELECT COUNT(*)
                                FROM Usuarios
                                WHERE Usuario = @usuario";

                int cantidad = connection.ExecuteScalar<int>(query, new { usuario });
                return cantidad > 0;
            }
        }

        public static void Register(Usuarios u)
        {
            using(SqlConnection connection = new SqlConnection(_connectionString))
            {
                string query = @"INSERT INTO Usuarios (Usuario, Password, Nombre)
                                VALUES (@usuario, @password, @nombre)";

                connection.Execute(query,
                    new
                    {
                        usuario = u.Usuario,
                        password = u.Password,
                        nombre = u.Nombre
                    });
            }
        } 

        public static Usuarios? GetUsuarioById(int pid)
        {
            using(SqlConnection connection = new SqlConnection(_connectionString))
            {
                string query = @"SELECT * 
                                FROM Usuarios
                                WHERE ID = @id";

                return connection.QueryFirstOrDefault<Usuarios?>(
                    query,
                    new
                    {
                        id = pid
                    });
            }
        }
        public static void UpdateUsuario(Usuarios u)
        {
            using(SqlConnection connection = new SqlConnection(_connectionString))
            {
                string query = @"UPDATE Usuarios
                                SET Usuario = @usuario,
                                    Password = @password,
                                    Nombre = @nombre
                                WHERE ID = @id";

                connection.Execute(query,
                    new
                    {
                        id = u.ID,
                        usuario = u.Usuario,
                        password = u.Password,
                        nombre = u.Nombre
                    });
            }
        }

        public static void GuardarPartida(int idUsuario, EstadoPartida estado)
        {
            using var connection = new SqlConnection(_connectionString);

            string estadoJson = JsonSerializer.Serialize(estado);
            DateTime ahora = DateTime.Now;

            var partidaExistente = connection.QuerySingleOrDefault<Partidas>(
                @"SELECT TOP 1 *
                  FROM Partidas
                  WHERE IDUsuario = @idUsuario
                  ORDER BY UltimoGuardado DESC",
                new { idUsuario });

            if (partidaExistente == null)
            {
                connection.Execute(
                    @"INSERT INTO Partidas (IDUsuario, FechaInicio, UltimoGuardado, Finalizada, EstadoJuego)
                      VALUES (@idUsuario, @fechaInicio, @ultimoGuardado, @finalizada, @estadoJuego)",
                    new
                    {
                        idUsuario,
                        fechaInicio = ahora,
                        ultimoGuardado = ahora,
                        finalizada = false,
                        estadoJuego = estadoJson
                    });
                return;
            }

            connection.Execute(
                @"UPDATE Partidas
                  SET UltimoGuardado = @ultimoGuardado,
                      Finalizada = @finalizada,
                      EstadoJuego = @estadoJuego
                  WHERE ID = @idPartida",
                new
                {
                    idPartida = partidaExistente.ID,
                    ultimoGuardado = ahora,
                    finalizada = false,
                    estadoJuego = estadoJson
                });
        }

        public static void BorrarPartidasUsuario(int idUsuario)
        {
            using var connection = new SqlConnection(_connectionString);

            connection.Execute(
                @"DELETE FROM Partidas
                  WHERE IDUsuario = @idUsuario",
                new { idUsuario });
        }

        // Crea la columna JuegoCompletado en Usuarios si la base todavía no la tiene.
        private static void AsegurarColumnaJuegoCompletado(SqlConnection connection)
        {
            connection.Execute(
                @"IF COL_LENGTH('Usuarios', 'JuegoCompletado') IS NULL
                  ALTER TABLE Usuarios ADD JuegoCompletado BIT NOT NULL CONSTRAINT DF_Usuarios_JuegoCompletado DEFAULT 0");
        }

        public static void MarcarJuegoCompletado(int idUsuario)
        {
            using var connection = new SqlConnection(_connectionString);
            AsegurarColumnaJuegoCompletado(connection);

            connection.Execute(
                @"UPDATE Usuarios
                  SET JuegoCompletado = 1
                  WHERE ID = @idUsuario",
                new { idUsuario });
        }

        public static bool UsuarioCompletoJuego(int idUsuario)
        {
            using var connection = new SqlConnection(_connectionString);
            AsegurarColumnaJuegoCompletado(connection);

            return connection.ExecuteScalar<bool>(
                @"SELECT JuegoCompletado
                  FROM Usuarios
                  WHERE ID = @idUsuario",
                new { idUsuario });
        }

        public static EstadoPartida? ObtenerPartidaActual(int idUsuario)
        {
            using var connection = new SqlConnection(_connectionString);

            var partida = connection.QuerySingleOrDefault<Partidas>(
                @"SELECT TOP 1 *
                  FROM Partidas
                  WHERE IDUsuario = @idUsuario
                  ORDER BY UltimoGuardado DESC",
                new { idUsuario });

            if (partida == null || string.IsNullOrWhiteSpace(partida.EstadoJuego))
            {
                return null;
            }

            return JsonSerializer.Deserialize<EstadoPartida>(
                partida.EstadoJuego,
                new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
        }
    }
    