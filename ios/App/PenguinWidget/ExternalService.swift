//
//  ExternalService.swift
//  PenguinWidgetExtension
//
//  Created by Galvin Gao on 2020/12/27.
//

import Foundation
import Alamofire

struct StatsResponse: Decodable {
    let stats: [StatsResponseStat]
}

struct StatsResponseStat: Decodable {
    let stage: StatsResponseStatStage
    let item: StatsResponseStatItem
    let quantity: Int
    let times: Int
    let recentTimes: Int
}

struct StatsResponseStatStage: Decodable {
    let zoneId: String
    let stageId: String
    let code_i18n: [String: String]
}

struct StatsResponseStatItem: Decodable {
    let itemId: String
    let name_i18n: [String: String]
}

func getRegionalEndpointBase() -> String {
    if Locale.current.regionCode == "CN" {
        return "https://widget.penguin-stats.cn"
    } else {
        return "https://widget.penguin-stats.io"
    }
}

func getStats(for server: PenguinServer, timeout: TimeInterval = TimeInterval(25.0), completion: @escaping (SiteStats?) -> ())  {
    print("received server for getStats:", server)
    AF.request("\(getRegionalEndpointBase())/api/stats/" + server.string(), requestModifier: {
        $0.timeoutInterval = timeout
    }).response {resp in
        guard let data = resp.data else {
            completion(nil)
            return
        }
        
        let stats: StatsResponse = try! JSONDecoder().decode(StatsResponse.self, from: data)
        
        var stages: [StageStats] = [];
        
        for stat in stats.stats {
            let item = ItemStats.init(id: stat.item.itemId,
                                      name: Localizer.localized(from: stat.item.name_i18n) ?? "unknown",
                                      times: stat.times, quantity: stat.quantity)
            
            let stage = StageStats.init(stageId: stat.stage.stageId,
                                        zoneId: stat.stage.zoneId,
                                        stageCode: Localizer.localized(from: stat.stage.code_i18n) ?? "unknown",
                                        items: [item],
                                        recentTimes: stat.recentTimes)
            stages.append(stage)
        }
        
        let siteStats = SiteStats.init(stages: stages, server: server)
        
        completion(siteStats)
    }
}
