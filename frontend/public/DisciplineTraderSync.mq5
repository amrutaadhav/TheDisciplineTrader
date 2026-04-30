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

//+------------------------------------------------------------------+
//| Expert initialization function                                   |
//+------------------------------------------------------------------+
int OnInit()
  {
   Print("Discipline Trader Sync EA Initialized. Key: ", SecretSyncKey);
   return(INIT_SUCCEEDED);
  }

//+------------------------------------------------------------------+
//| TradeTransaction function                                        |
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
