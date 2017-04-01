package com.myson.smppsimulator;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Component;

import com.myson.smppsimulator.util.Constants;
import com.myson.smppsimulator.util.StringUtils;

@Component
public class SimpleCORSFilter implements Filter {
	private Logger logger = Logger.getLogger(SimpleCORSFilter.class);

	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
			throws IOException, ServletException {
		HttpServletRequest request = (HttpServletRequest) req;
		String ipAddress = request.getRemoteAddr();

		String path = request.getRequestURI().substring(request.getContextPath().length());
		logger.info("IP: " + ipAddress + "\tRequest: " + request.getMethod() + " " + path);
		 path = StringUtils.getRequestMapping(path);
		 switch (path) {
			 case Constants.MAPPING_REQUEST_RS:
			 case Constants.STOMPENDPOINT:
				 setCorsForRespon(res);
				 break;
			 default:
				 break;
		 }
		chain.doFilter(req, res);
	}

	private void setCorsForRespon(ServletResponse res) {
		HttpServletResponse response = (HttpServletResponse) res;
		response.setHeader("Access-Control-Allow-Origin", "*");
		response.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS, DELETE");
		response.setHeader("Access-Control-Max-Age", "3600");
		response.setHeader("Origin", "*");
		response.setHeader("Access-Control-Allow-Headers",
		        " X-Requested-With, Content-Type, Accept, Authorization");
//		response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, "
//				+ Constant.AUTHORIZATION_ID + ", " + Constant.AUTHORIZATION_KEY);
	}

	public void init(FilterConfig filterConfig) {
	}

	public void destroy() {
	}

}
