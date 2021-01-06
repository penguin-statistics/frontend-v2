//
//  WidgetFooter.swift
//  PenguinWidgetExtension
//
//  Created by Galvin Gao on 2020/12/26.
//

import SwiftUI

struct WidgetFooter: View {
    var body: some View {
        HStack {
            HStack(spacing: 4) {
                Text("WidgetViewMore")
                    .bold()
                Image(systemName: "arrow.up.forward.app")
            }
            .font(.caption)
            .foregroundColor(Color("Gray4"))
            .padding(4)
            .background(Color.gray.opacity(0.1))
            .cornerRadius(4.0)
                
            Spacer()
            Image("Logo")
                .resizable()
                .frame(width: 20, height: 20, alignment: .center)
                .unredacted()
        }
    }
}

struct WidgetFooter_Previews: PreviewProvider {
    static var previews: some View {
        WidgetFooter()
    }
}
