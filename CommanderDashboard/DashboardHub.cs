using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CommanderDashboard
{
    // id: 0, name: 'Najeela', twitter: '@goberthicks', life: 100, p0: 0, p1: 0, p2: 0, p3: 0, cb: false, m: false
    public class Player
    {
        public int id { get; set; }
        public string name { get; set; }
        public string twitter { get; set; }
        public int life { get; set; }
        public int p0 { get; set; }
        public int p1 { get; set; }
        public int p2 { get; set; }
        public int p3 { get; set; }
        public bool cb { get; set; }
        public bool m { get; set; }
    }

    public class DashboardHub : Hub
    {
        private static List<Player> players = new List<Player>
        {
            new Player { name = "Needs Setup", life = 0 },
            new Player { name = "Needs Setup", life = 1 },
            new Player { name = "Needs Setup", life = 2 },
            new Player { name = "Needs Setup", life = 3 }
        };

        public async Task GetPlayer(int index)
        {
            await Clients.Caller.SendAsync("updatePlayer", DashboardHub.players[index], index);
        }

        public async Task SetPlayers(Player player0, Player player1, Player player2, Player player3)
        {
            DashboardHub.players[0] = player0;
            DashboardHub.players[1] = player1;
            DashboardHub.players[2] = player2;
            DashboardHub.players[3] = player3;
            for (int i = 0; i < 4; i++)
            {
                await Clients.All.SendAsync("updatePlayer", DashboardHub.players[i], i);
            }
        }
    }
}
