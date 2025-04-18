# frozen_string_literal: true

class UserVisit < ActiveRecord::Base
  def self.counts_by_day_query(start_date, end_date, group_id = nil)
    result = where('visited_at >= ? and visited_at <= ?', start_date.to_date, end_date.to_date)

    if group_id
      result = result.joins("INNER JOIN users ON users.id = user_visits.user_id")
      result = result.joins("INNER JOIN group_users ON group_users.user_id = users.id")
      result = result.where("group_users.group_id = ?", group_id)
    end
    result.group(:visited_at).order(:visited_at)
  end

  def self.count_by_active_users(start_date, end_date)
    start_date_keep = start_date - 1.month
    sql = <<~SQL
      SELECT
          dau.date,
          max(dau.dau) AS dau,
          count(DISTINCT uv.user_id) AS mau
      FROM (
            SELECT
                user_visits.visited_at AS date,
                count(DISTINCT user_visits.user_id) AS dau
            FROM
                user_visits
            WHERE
                user_visits.visited_at >= date(:start_date)
                AND user_visits.visited_at <= date(:end_date)
            GROUP BY
                user_visits.visited_at
            ORDER BY
                user_visits.visited_at
          ) dau
          
          JOIN user_visits uv ON uv.visited_at BETWEEN dau.date - 29 AND dau.date
              AND uv.visited_at >= date(:start_date_keep) 
              AND uv.visited_at <= date(:end_date)
      GROUP BY
          dau.date
      ORDER BY
          dau.date ASC;
    SQL
    DB.exec "SET SESSION tidb_allow_mpp = 1"
    DB.query_hash(sql, start_date: start_date, end_date: end_date, start_date_keep: start_date_keep)
  end

  # A count of visits in a date range by day
  def self.by_day(start_date, end_date, group_id = nil)
    counts_by_day_query(start_date, end_date, group_id).count
  end

  def self.mobile_by_day(start_date, end_date, group_id = nil)
    counts_by_day_query(start_date, end_date, group_id).where(mobile: true).count
  end

  def self.ensure_consistency!
    DB.exec <<~SQL
      UPDATE user_stats u set days_visited =
      (
        SELECT COUNT(*) FROM user_visits v WHERE v.user_id = u.user_id
      )
      WHERE days_visited <>
      (
        SELECT COUNT(*) FROM user_visits v WHERE v.user_id = u.user_id
      )
    SQL
  end
end

# == Schema Information
#
# Table name: user_visits
#
#  id         :bigint           not null, primary key
#  user_id    :integer          not null
#  visited_at :date             not null
#  posts_read :integer          default(0)
#  mobile     :boolean          default(FALSE)
#  time_read  :integer          default(0), not null
#
# Indexes
#
#  index_user_visits_on_user_id_and_visited_at                (user_id,visited_at) UNIQUE
#  index_user_visits_on_user_id_and_visited_at_and_time_read  (user_id,visited_at,time_read)
#  index_user_visits_on_visited_at_and_mobile                 (visited_at,mobile)
#
