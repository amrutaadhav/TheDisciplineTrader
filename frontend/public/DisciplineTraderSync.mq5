//+------------------------------------------------------------------+
//|                                     DisciplineTraderSync.mq5      |
//|                                     Copyright 2026, Amruta Adhav  |
//|                                     https://thedisciplinetrader.com|
//+------------------------------------------------------------------+
#property copyright "Amruta Adhav"
#property link      "https://thedisciplinetrader.com"
#property version   "1.00"

//--- Input Parameters
input string SecretSyncKey = "Paste_Key_Here";
input string BackendURL = "http://localhost:5000/api/mt5/sync";
input bool   SyncPastHistoryOnStartup = true;
input int    MaxHistoryTradesToSync = 50;

//+------------------------------------------------------------------+
//| Expert initialization function                                   |
//+------------------------------------------------------------------+
int OnInit()
  {
   Print("Discipline Trader Sync EA Initialized. Key: ", SecretSyncKey);
   
   if(SyncPastHistoryOnStartup)
     {
      SyncPastHistory();
     }
     
   return(INIT_SUCCEEDED);
  }

//+------------------------------------------------------------------+
//| Bulk Sync Past History Function                                  |
//+------------------------------------------------------------------+
void SyncPastHistory()
  {
   HistorySelect(0, TimeCurrent());
   int total = HistoryDealsTotal();
   int count = 0;
   
   string json = "{\"syncKey\":\"" + SecretSyncKey + "\", \"trades\":[";
   
   for(int i = total - 1; i >= 0; i--)
     {
      ulong ticket = HistoryDealGetTicket(i);
      if(ticket > 0)
        {
         long type = HistoryDealGetInteger(ticket, DEAL_TYPE);
         double profit = HistoryDealGetDouble(ticket, DEAL_PROFIT);
         
         if((type == DEAL_TYPE_BUY || type == DEAL_TYPE_SELL) && profit != 0)
           {
            string symbol = HistoryDealGetString(ticket, DEAL_SYMBOL);
            double entry = HistoryDealGetDouble(ticket, DEAL_PRICE);
            
            if(count > 0) json += ",";
            
            json += "{" +
                    "\"pair\":\"" + symbol + "\"," +
                    "\"entry\":\"" + DoubleToString(entry, 5) + "\"," +
                    "\"pl\":\"" + DoubleToString(profit, 2) + "\"}";
            
            count++;
            if(count >= MaxHistoryTradesToSync) break;
           }
        }
     }
     
   json += "]}";
   
   if(count > 0)
     {
      char post[], result[];
      string headers;
      StringToCharArray(json, post, 0, WHOLE_ARRAY, CP_UTF8);
      string custom_headers = "Content-Type: application/json\r\n";
      
      int res = WebRequest("POST", BackendURL, custom_headers, 10000, post, result, headers);
      if(res == 200)
         Print("Successfully bulk-synced ", count, " past trades to the Dashboard!");
      else
         Print("Failed to bulk sync history. Error code: ", GetLastError(), " WebRequest Code: ", res);
     }
  }

//+------------------------------------------------------------------+
//| TradeTransaction function (Real-time sync)                       |
//+------------------------------------------------------------------+
void OnTradeTransaction(const MqlTradeTransaction& trans, const MqlTradeRequest& request, const MqlTradeResult& result)
  {
   // Only trigger when a deal is executed (trade closed/opened)
   if(trans.type == TRADE_TRANSACTION_DEAL_ADD)
     {
      double profit = HistoryDealGetDouble(trans.deal, DEAL_PROFIT);
      string symbol = HistoryDealGetString(trans.deal, DEAL_SYMBOL);
      double entry = HistoryDealGetDouble(trans.deal, DEAL_PRICE);
      
      // If it's a closing deal and profit is not zero
      if (profit != 0) 
        {
         SendTradeToWebsite(symbol, entry, profit);
        }
     }
  }

//+------------------------------------------------------------------+
//| Webhook Function                                                 |
//+------------------------------------------------------------------+
void SendTradeToWebsite(string pair, double entry, double pl)
  {
   string cookie = NULL, headers;
   char post[], result[];
   
   // Create JSON Payload
   string json = "{\"syncKey\":\"" + SecretSyncKey + "\"," +
                 "\"pair\":\"" + pair + "\"," +
                 "\"entry\":\"" + DoubleToString(entry, 5) + "\"," +
                 "\"pl\":\"" + DoubleToString(pl, 2) + "\"," +
                 "\"setup\":\"MT5 Webhook Auto-Sync\"}";
                 
   StringToCharArray(json, post, 0, WHOLE_ARRAY, CP_UTF8);
   string custom_headers = "Content-Type: application/json\r\n";
   
   int res = WebRequest("POST", BackendURL, custom_headers, 5000, post, result, headers);
   
   if(res == 200)
      Print("Trade Successfully Synced to Discipline Trader Dashboard!");
   else
      Print("Failed to Sync Trade. Error code: ", GetLastError(), " WebRequest Code: ", res);
  }
