using System.Security.Cryptography;
using System.Text;

namespace TK_ENERGY_GP_PORTAL.Resources
{
    public class Utilities
    {

        public static string Encript(string text)
        {
            string key = "3XECL3C**S3Mll4.*";
            byte[] keyBytes = Encoding.ASCII.GetBytes(key);

            var encoding = new ASCIIEncoding();
            var textBytes = encoding.GetBytes(text);
            Byte[] hashBytes;


            using (var hash = new HMACSHA256(keyBytes))

                hashBytes = hash.ComputeHash(textBytes);

            StringBuilder stringBuilder = new StringBuilder();

            foreach (byte b in hashBytes)
                stringBuilder.AppendFormat("{0:X2}", b);

            return stringBuilder.ToString();

        }

        /// <summary>
        /// Calcula el LUHN, que es para validar la integridad de un número serial de un Medidor STS.
        /// </summary>
        /// <param name="serial">Número serial del Medidor.</param>
        /// <param name="longitud">Longitud del campo serial (incluyendo el LUHN). La longitud es 11 o 13. Si se envía en 0, se calcula la longitud dentro de la función.</param>
        /// <returns>Retorna un byte que contiene el cálculo del LUHN.</returns>
        /// 

        public static byte CalcularLuhn(string serial, int longitud)
        {
            if (longitud == 0)
                longitud = serial.Length;

            byte[] numeros = Encoding.UTF8.GetBytes(serial);
            byte resultadoLuhn = 0;
            byte multiplicador = 2;

            // Validar que el serial sea numérico
            for (int i = 0; i < longitud - 1; i++)
            {
                if (numeros[i] < 0x30 || numeros[i] > 0x39) // Verifica si no es un dígito
                    return 0; // Devuelve 0 si hay caracteres no válidos
            }

            // Aplicar algoritmo de Luhn
            for (int i = longitud - 2; i >= 0; i--)
            {
                byte valorActual = (byte)(numeros[i] - 0x30); // Convertir el carácter a su valor numérico
                byte producto = (byte)(valorActual * multiplicador);

                if (producto > 9)
                    producto -= 9;

                resultadoLuhn += producto;
                multiplicador = (multiplicador == 2) ? (byte)1 : (byte)2; // Alternar entre 2 y 1
            }

            resultadoLuhn = (byte)(10 - (resultadoLuhn % 10));
            return (resultadoLuhn == 10) ? (byte)0 : resultadoLuhn;
        }

        /// <summary>
        /// Valida la integridad de un número serial de un Medidor STS utilizando el valor del LUHN.
        /// </summary>
        /// <param name="serial">Número serial del Medidor.</param>
        /// <returns>Retorna true si el cálculo del LUHN es correcto, caso contrario retorna false.</returns>
        /// 

        public static bool ValidarLuhn(string serial)
        {
            if (string.IsNullOrEmpty(serial))
                return false;

            int longitud = serial.Length;
            byte luhnCalculado = CalcularLuhn(serial, longitud);

            // Comparar el último dígito del serial con el cálculo del LUHN
            byte ultimoDigito = (byte)(serial[longitud - 1] - 0x30);
            return luhnCalculado == ultimoDigito;
        }
    }
}
